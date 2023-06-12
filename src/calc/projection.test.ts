import { assert, expect, test } from "vitest";
import { defaultRowOptions } from "./defaultRowOptions";
import type { CalcOptions } from "./projection";
import { calculateFullData, calculateYearData } from "./projection";

const options: CalcOptions = {
  graduatingYear: 2021,
  loanBalance: 5000,
  loanPeriod: 30,
  repaymentThreshold: 27295,
  salary: 30000,
  rowOptions: defaultRowOptions,
};

test("Calculate year data when first calculated row", () => {
  const startingRow = {
    currentLoanYear: options.loanPeriod - 28 - 1,
    graduatingYear: options.graduatingYear,
    salary: options.salary,
    calendarYear: 2023 - 1,
    totalDebt: options.loanBalance,
    interestRate: options.rowOptions.interestRate,
    annualInterest: 0,
    repaymentThreshold: options.repaymentThreshold,
    annualRepayment: 0,
    totalRepaid: 0,
    yearsUntilWiped: 28,
  };
  const result = calculateYearData(startingRow, options.rowOptions);

  const expectedRow = {
    currentLoanYear: 2,
    graduatingYear: 2021,
    salary: 30000,
    calendarYear: 2023,
    totalDebt: 5000,
    interestRate: 3,
    annualInterest: 150,
    repaymentThreshold: 27295,
    annualRepayment: 243.45,
    totalRepaid: 243.45,
    yearsUntilWiped: 27,
  };

  assert.deepEqual(result, expectedRow);
});

test("Calculate year data when not first calculated row", () => {
  const firstRow = {
    currentLoanYear: 2,
    graduatingYear: 2021,
    salary: 30000,
    calendarYear: 2023,
    totalDebt: 5000,
    interestRate: 3,
    annualInterest: 150,
    repaymentThreshold: 27295,
    annualRepayment: 243.45,
    totalRepaid: 243.45,
    yearsUntilWiped: 27,
  };

  const result = calculateYearData(firstRow, options.rowOptions);

  const expected = {
    annualInterest: 147.1965,
    annualRepayment: 280.18800000000005,
    calendarYear: 2024,
    currentLoanYear: 3,
    graduatingYear: 2021,
    interestRate: 3,
    repaymentThreshold: 28386.8,
    salary: 31500,
    totalDebt: 4906.55,
    totalRepaid: 523.638,
    yearsUntilWiped: 26,
  };

  assert.deepEqual(result, expected);
});

test("Calculate full total debt data", () => {
  const rowArray = calculateFullData([], options);

  const totalDebtArray = rowArray.map((row) =>
    Math.round(row?.totalDebt ?? -1)
  );

  expect(totalDebtArray).toEqual([
    5000, 4907, 4774, 4597, 4373, 4096, 3761, 3364, 2899, 2359, 1737, 1028, 222,
    7, 0,
  ]);
});
