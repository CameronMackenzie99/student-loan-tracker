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

const currentYear = new Date().getFullYear();

export const calculateFullData = (rows: YearRow[], options: CalcOptions) => {
  let [startingRow] = rows.slice(-1);

  const yearsUntilWiped =
    options.loanPeriod -
    (currentYear - options.graduatingYear >= 0
      ? currentYear - options.graduatingYear
      : 0);

  if (startingRow === undefined) {
    startingRow = {
      currentLoanYear: options.loanPeriod - yearsUntilWiped - 1,
      graduatingYear: options.graduatingYear,
      salary: options.salary,
      calendarYear: currentYear - 1,
      totalDebt: options.loanBalance,
      interestRate: options.rowOptions.interestRate,
      annualInterest: 0,
      repaymentThreshold: options.repaymentThreshold,
      annualRepayment: 0,
      totalRepaid: 0,
      yearsUntilWiped: yearsUntilWiped,
    };
  }

  const resultRows = [calculateYearData(startingRow, options.rowOptions)!];

  while (resultRows.length < yearsUntilWiped) {
    const lastRow = resultRows[resultRows.length - 1];
    if (lastRow == undefined) break;
    const newRow = calculateYearData(lastRow, options.rowOptions);
    if (newRow === null) break;
    resultRows.push(newRow);
  }
  return resultRows;
};

export const calculateYearData = (row: YearRow, rowOptions: RowOptions) => {
  if (row.yearsUntilWiped === 0 || Math.round(row.totalDebt) === 0) {
    return null;
  }

  const calendarYear = row.calendarYear + 1;
  const yearsUntilWiped = row.yearsUntilWiped - 1;

  const totalDebt = Math.max(
    row.totalDebt + row.annualInterest - row.annualRepayment,
    0
  );

  const annualInterest = totalDebt * (row.interestRate / 100);

  const currentLoanYear =
    row.graduatingYear > calendarYear ? 0 : calendarYear - row.graduatingYear;

  const isFirstCalculatedRow =
    currentLoanYear === 0 || calendarYear === currentYear;

  const adjustedSalary = isFirstCalculatedRow
    ? row.salary
    : row.salary * rowOptions.averageSalaryGrowth;

  const repaymentThreshold = isFirstCalculatedRow
    ? row.repaymentThreshold
    : row.repaymentThreshold * rowOptions.repaymentThresholdGrowth;

  const annualRepayment = calculateAnnualRepayment(
    adjustedSalary,
    repaymentThreshold,
    totalDebt,
    annualInterest,
    rowOptions
  );

  return {
    currentLoanYear: currentLoanYear,
    graduatingYear: row.graduatingYear,
    salary: adjustedSalary,
    calendarYear: calendarYear,
    totalDebt: totalDebt,
    interestRate: row.interestRate,
    annualInterest: annualInterest,
    repaymentThreshold: repaymentThreshold,
    annualRepayment: annualRepayment,
    totalRepaid: row.totalRepaid + annualRepayment,
    yearsUntilWiped: yearsUntilWiped,
  } as YearRow;
};

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
