import { assert, expect, test } from "vitest";
import { defaultRowOptions } from "./defaultRowOptions";
import type { CalcOptions } from "./projection";
import {
  calculateFullData,
  calculateYearRow,
  calculateInitialYearRow,
} from "./projection";

const options: CalcOptions = {
  graduatingYear: 2021,
  loanBalance: 5000,
  loanPeriod: 30,
  repaymentThreshold: 27295,
  salary: 30000,
  rowOptions: defaultRowOptions,
};

const options2: CalcOptions = {
  graduatingYear: 2021,
  loanBalance: 50000,
  loanPeriod: 30,
  repaymentThreshold: 27295,
  salary: 30000,
  rowOptions: defaultRowOptions,
};

test("Calculate year data when first calculated row", () => {
  const startingRowInputs = {
    totalDebt: options.loanBalance,
    interestRate: options.rowOptions.interestRate,
    annualRepayment: 0,
    totalRepaid: 0,
  };
  const result = calculateInitialYearRow(startingRowInputs, options);

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
    yearsUntilWiped: 29,
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

  const result = calculateYearRow(firstRow, options.rowOptions);

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

const expected1 = [
  5000, 4907, 4774, 4597, 4373, 4096, 3761, 3364, 2899, 2359, 1737, 1028, 222,
  7,
];

const expected2 = [
  50000, 51257, 52514, 53770, 55021, 56263, 57494, 58709, 59903, 61073, 62213,
  63318, 64381, 65397, 66358, 67257, 68086, 68836, 69497, 70061, 70515, 70850,
  71051, 71106, 71001, 70720, 70247, 69565, 68655,
];

test.each([
  [options, expected1],
  [options2, expected2],
])("Calculate full total debt data", (opts, expected) => {
  const rowArray = calculateFullData([], opts);

  const totalDebtArray = rowArray.map((row) =>
    Math.round(row?.totalDebt ?? -1)
  );

  expect(totalDebtArray).toEqual(expected);
});
