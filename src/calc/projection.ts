import type { FormDataType } from "@/components/MultiStepForm";
import type { YearRow } from "../components/LoanProjection";
import { calcInflation } from "./inflationAdjustment";

export interface RowOptions {
  averageSalaryGrowth: number;
  repaymentThresholdGrowth: number;
  incomePercentageTaxedOverThreshold: number;
  planInterestRate: number;
  averageInterestRate: number;
}

export interface CalcOptions {
  loanPeriod: number;
  repaymentThreshold: number;
  salary: number;
  graduatingYear: number;
  rowOptions: RowOptions;
  //TODO: plan - may incorporate weekly changes to threshold/interest
}

const CURRENT_YEAR = new Date().getFullYear();

export const calculateFullData = (
  formInput: FormDataType,
  options: CalcOptions
) => {
  let rows: (YearRow | PreGradYearRow)[] = [];

  if (!formInput.data) {
    throw new Error("data is undefined");
  }

  let rowsToCalculateCount = 0;

  if (formInput.student === "current") {
    rows = calculatePreGraduationRows(
      formInput.data.courseStartYear,
      formInput.data.courseLength,
      formInput.data.yearlyMaintenance + formInput.data.yearlyTuition,
      options.rowOptions.planInterestRate
    );
    rowsToCalculateCount = options.loanPeriod;
  }

  if (formInput.student === "graduate") {
    rows.push(
      calculateInitialYearRow(
        {
          totalDebt: formInput.data.currentLoanBalance,
          annualRepayment: 0,
          totalRepaid: 0,
          interestRate: options.rowOptions.planInterestRate,
        },
        options
      )
    );
    rowsToCalculateCount = (rows.at(-1)?.yearsUntilWiped ?? 0) - 1;
  }

  return calculateSubsequentRows(
    rowsToCalculateCount,
    options,
    rows as YearRow[]
  );
};

export type RowInputs = Pick<
  YearRow,
  "totalDebt" | "interestRate" | "annualRepayment" | "totalRepaid"
>;

export const recalculateEditedRow = (
  editedRow: YearRow,
  rowInputs: RowInputs,
  options: CalcOptions
) => {
  const annualInterest = calculateAnnualInterest(
    editedRow.totalDebt,
    editedRow.interestRate
  );

  const annualRepayment = calculateAnnualRepayment(
    editedRow.salary,
    editedRow.repaymentThreshold,
    editedRow.totalDebt,
    annualInterest,
    options.rowOptions.incomePercentageTaxedOverThreshold
  );

  const totalRepaid = rowInputs.totalRepaid + annualRepayment;

  return {
    ...editedRow,
    annualInterest: annualInterest,
    annualRepayment: annualRepayment,
    totalRepaid: totalRepaid,
  };
};

export const calculateInitialYearRow = (
  //TODO: disco-union the row inputs depending on first row or edited
  rowInputs: RowInputs,
  options: CalcOptions
) => {
  const annualInterest = calculateAnnualInterest(
    rowInputs.totalDebt,
    rowInputs.interestRate
  );

  const currentLoanYear = calculateCurrentLoanYear(
    options.graduatingYear,
    CURRENT_YEAR
  );

  const annualRepayment =
    currentLoanYear > 0
      ? calculateAnnualRepayment(
          options.salary,
          options.repaymentThreshold,
          rowInputs.totalDebt,
          annualInterest,
          options.rowOptions.incomePercentageTaxedOverThreshold
        )
      : 0;
  const totalRepaid = 0 + annualRepayment;

  const yearsUntilWiped = calculateYearsUntilWiped(
    options.loanPeriod,
    options.graduatingYear,
    CURRENT_YEAR
  );
  return {
    currentLoanYear: currentLoanYear,
    graduatingYear: options.graduatingYear,
    salary: options.salary,
    calendarYear: CURRENT_YEAR,
    totalDebt: rowInputs.totalDebt,
    interestRate: options.rowOptions.planInterestRate,
    annualInterest: annualInterest,
    repaymentThreshold: options.repaymentThreshold,
    annualRepayment: annualRepayment,
    totalRepaid: totalRepaid,
    yearsUntilWiped: yearsUntilWiped,
  };
};

export const calculateYearRow = (
  prevRowInputs: {
    yearsUntilWiped: number;
    calendarYear: number;
    totalDebt: number;
    annualInterest: number;
    annualRepayment: number;
    salary: number;
    repaymentThreshold: number;
    totalRepaid: number;
  },
  options: CalcOptions
) => {
  const calendarYear = prevRowInputs.calendarYear + 1;
  const yearsUntilWiped = prevRowInputs.yearsUntilWiped - 1;

  const totalDebt = calculateTotalDebt(
    prevRowInputs.totalDebt,
    prevRowInputs.annualInterest,
    prevRowInputs.annualRepayment
  );

  const annualInterest = calculateAnnualInterest(
    totalDebt,
    options.rowOptions.averageInterestRate
  );

  const currentLoanYear =
    //TODO: get from options, remove graduatingYear from row as immutable
    calculateCurrentLoanYear(options.graduatingYear, calendarYear);

  const adjustedSalary =
    prevRowInputs.salary * options.rowOptions.averageSalaryGrowth;

  const repaymentThreshold =
    prevRowInputs.repaymentThreshold *
    options.rowOptions.repaymentThresholdGrowth;

  const annualRepayment =
    currentLoanYear > 0
      ? calculateAnnualRepayment(
          adjustedSalary,
          repaymentThreshold,
          totalDebt,
          annualInterest,
          options.rowOptions.incomePercentageTaxedOverThreshold
        )
      : 0;

  return {
    currentLoanYear: currentLoanYear,
    graduatingYear: options.graduatingYear,
    salary: adjustedSalary,
    calendarYear: calendarYear,
    totalDebt: totalDebt,
    interestRate: options.rowOptions.averageInterestRate,
    annualInterest: annualInterest,
    repaymentThreshold: repaymentThreshold,
    annualRepayment: annualRepayment,
    totalRepaid: prevRowInputs.totalRepaid + annualRepayment,
    yearsUntilWiped: yearsUntilWiped,
  } as YearRow;
};

export function calculateSubsequentRows(
  rowsToCalculateCount: number,
  options: CalcOptions,
  rows: YearRow[]
) {
  if (rows.length === 0) {
    throw new Error("rows cannot be empty");
  }
  for (let i = 0; i < rowsToCalculateCount; i++) {
    const {
      yearsUntilWiped = rowsToCalculateCount,
      calendarYear,
      totalDebt,
      annualRepayment = 0,
      annualInterest = 0,
      salary = calcInflation(
        options.salary,
        options.rowOptions.averageInterestRate,
        CURRENT_YEAR,
        calendarYear
      ),
      repaymentThreshold = calcInflation(
        options.repaymentThreshold,
        options.rowOptions.averageInterestRate,
        CURRENT_YEAR,
        calendarYear
      ),
      totalRepaid = 0,
    } = rows.at(-1)!;

    const newRow = calculateYearRow(
      {
        yearsUntilWiped,
        calendarYear,
        totalDebt,
        annualRepayment,
        annualInterest,
        salary,
        repaymentThreshold,
        totalRepaid,
      },
      options
    );
    rows.push(newRow);
    if (Math.round(newRow.totalDebt) === 0) break;
  }
  return rows;
}

function calculateYearsUntilWiped(
  loanPeriod: number,
  graduatingYear: number,
  currentYear: number
) {
  return loanPeriod - (currentYear - graduatingYear - 1);
}

function calculateCurrentLoanYear(
  graduatingYear: number,
  calendarYear: number
) {
  return graduatingYear > calendarYear ? 0 : calendarYear - graduatingYear;
}

function calculateAnnualInterest(totalDebt: number, interestRate: number) {
  return totalDebt * (interestRate / 100);
}

function calculateTotalDebt(
  totalDebt: number,
  annualInterest: number,
  annualRepayment: number
) {
  return Math.max(totalDebt + annualInterest - annualRepayment, 0);
}

function calculateAnnualRepayment(
  salary: number,
  repaymentThreshold: number,
  totalDebt: number,
  annualInterest: number,
  incomePercentageTaxedOverThreshold: number
) {
  if (salary < repaymentThreshold) {
    return 0;
  } else {
    const maxRepayment =
      (salary - repaymentThreshold) * incomePercentageTaxedOverThreshold;

    const annualRepayment =
      totalDebt + annualInterest - maxRepayment < 0 ? totalDebt : maxRepayment;

    return annualRepayment;
  }
}

export type PreGradYearRow = Partial<YearRow> &
  Pick<
    YearRow,
    "calendarYear" | "totalDebt" | "interestRate" | "annualInterest"
  >;

export function calculatePreGraduationRows(
  courseStartYear: number,
  courseLength: number,
  perYearLoan: number,
  interestRate: number
) {
  const rows: PreGradYearRow[] = [];

  for (let courseYear = 1; courseYear <= courseLength; courseYear++) {
    const {
      totalDebt: prevTotalDebt = 0,
      annualInterest: prevAnnualInterest = 0,
    } = rows.at(-1) ?? {};

    const totalDebt = calculateTotalDebt(
      prevTotalDebt + perYearLoan,
      prevAnnualInterest,
      0
    );

    const row: PreGradYearRow = {
      calendarYear: courseStartYear + courseYear,
      totalDebt,
      interestRate,
      annualInterest: calculateAnnualInterest(totalDebt, interestRate),
    };
    rows.push(row);
  }
  return rows;
}
