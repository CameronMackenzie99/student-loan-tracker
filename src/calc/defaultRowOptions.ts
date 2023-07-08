import type { RowOptions } from "./projection";

export const AVERAGE_SALARY_GROWTH = 1.05;
export const REPAYMENT_THRESHOLD_GROWTH = 1.04;
const INCOME_PERCENTAGE_OVER_THRESHOLD = 0.09;
const INTEREST_RATE = 3;

export const defaultRowOptions: RowOptions = {
  averageSalaryGrowth: AVERAGE_SALARY_GROWTH,
  incomePercentageTaxedOverThreshold: INCOME_PERCENTAGE_OVER_THRESHOLD,
  interestRate: INTEREST_RATE,
  repaymentThresholdGrowth: REPAYMENT_THRESHOLD_GROWTH,
};
