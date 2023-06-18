import type { YearRow } from "../components/LoanTable";

export interface RowOptions {
  averageSalaryGrowth: number;
  repaymentThresholdGrowth: number;
  incomePercentageTaxedOverThreshold: number;
  interestRate: number;
}

export interface CalcOptions {
  loanPeriod: number;
  repaymentThreshold: number;
  salary: number;
  graduatingYear: number;
  loanBalance: number;
  rowOptions: RowOptions;
  //TODO: plan - may incorporate weekly changes to threshold/interest
}

const CURRENT_YEAR = new Date().getFullYear();

export const calculateFullData = (rows: YearRow[], options: CalcOptions) => {
  let [startingRow] = rows.slice(-1);

  const yearsUntilWiped = calculateYearsUntilWiped(
    options.loanPeriod,
    options.graduatingYear
  );
  if (startingRow === undefined) {
    startingRow = calculateInitialYearRow(
      {
        totalDebt: options.loanBalance,
        annualRepayment: 0,
        totalRepaid: 0,
        interestRate: options.rowOptions.interestRate,
      },
      options
    );
  }

  const resultRows = [startingRow];

  while (resultRows.length <= yearsUntilWiped) {
    const lastRow = resultRows[resultRows.length - 1];
    if (lastRow == undefined) break;
    const newRow = calculateYearRow(lastRow, options.rowOptions);
    if (newRow.yearsUntilWiped === 0 || Math.round(newRow.totalDebt) === 0)
      break;
    resultRows.push(newRow);
  }
  return resultRows;
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
    options.rowOptions
  );

  const totalRepaid = rowInputs.totalRepaid + annualRepayment;

  return {
    currentLoanYear: editedRow.currentLoanYear,
    graduatingYear: editedRow.graduatingYear,
    salary: editedRow.salary,
    calendarYear: editedRow.calendarYear,
    totalDebt: editedRow.totalDebt,
    interestRate: editedRow.interestRate,
    annualInterest: annualInterest,
    repaymentThreshold: editedRow.repaymentThreshold,
    annualRepayment: annualRepayment,
    totalRepaid: totalRepaid,
    yearsUntilWiped: editedRow.yearsUntilWiped,
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

  const annualRepayment = calculateAnnualRepayment(
    options.salary,
    options.repaymentThreshold,
    options.loanBalance,
    annualInterest,
    options.rowOptions
  );

  const totalRepaid = 0 + annualRepayment;

  const currentLoanYear = calculateCurrentLoanYear(
    options.graduatingYear,
    CURRENT_YEAR
  );

  const yearsUntilWiped = calculateYearsUntilWiped(
    options.loanPeriod,
    options.graduatingYear
  );
  return {
    currentLoanYear: currentLoanYear,
    graduatingYear: options.graduatingYear,
    salary: options.salary,
    calendarYear: CURRENT_YEAR,
    totalDebt: options.loanBalance,
    interestRate: options.rowOptions.interestRate,
    annualInterest: annualInterest,
    repaymentThreshold: options.repaymentThreshold,
    annualRepayment: annualRepayment,
    totalRepaid: totalRepaid,
    yearsUntilWiped: yearsUntilWiped,
  };
};

export const calculateYearRow = (prevRow: YearRow, rowOptions: RowOptions) => {
  const calendarYear = prevRow.calendarYear + 1;
  const yearsUntilWiped = prevRow.yearsUntilWiped - 1;

  const totalDebt = calculateTotalDebt(
    prevRow.totalDebt,
    prevRow.annualInterest,
    prevRow.annualRepayment
  );

  const annualInterest = calculateAnnualInterest(
    totalDebt,
    prevRow.interestRate
  );

  const currentLoanYear =
    //TODO: get from options, remove graduatingYear from row as immutable
    calculateCurrentLoanYear(prevRow.graduatingYear, calendarYear);

  const adjustedSalary = prevRow.salary * rowOptions.averageSalaryGrowth;

  const repaymentThreshold =
    prevRow.repaymentThreshold * rowOptions.repaymentThresholdGrowth;

  const annualRepayment = calculateAnnualRepayment(
    adjustedSalary,
    repaymentThreshold,
    totalDebt,
    annualInterest,
    rowOptions
  );

  return {
    currentLoanYear: currentLoanYear,
    graduatingYear: prevRow.graduatingYear,
    salary: adjustedSalary,
    calendarYear: calendarYear,
    totalDebt: totalDebt,
    interestRate: prevRow.interestRate,
    annualInterest: annualInterest,
    repaymentThreshold: repaymentThreshold,
    annualRepayment: annualRepayment,
    totalRepaid: prevRow.totalRepaid + annualRepayment,
    yearsUntilWiped: yearsUntilWiped,
  } as YearRow;
};

function calculateYearsUntilWiped(loanPeriod: number, graduatingYear: number) {
  return (
    loanPeriod -
    (CURRENT_YEAR - graduatingYear >= 0 ? CURRENT_YEAR - graduatingYear - 1 : 0)
  );
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
  rowOptions: RowOptions
) {
  if (salary < repaymentThreshold) {
    return 0;
  } else {
    const maxRepayment =
      (salary - repaymentThreshold) *
      rowOptions.incomePercentageTaxedOverThreshold;

    const annualRepayment =
      totalDebt + annualInterest - maxRepayment < 0 ? totalDebt : maxRepayment;

    return annualRepayment;
  }
}
