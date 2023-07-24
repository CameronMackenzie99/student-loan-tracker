import type { RowOptions } from "./projection";

export const AVERAGE_SALARY_GROWTH = 1.05;
export const REPAYMENT_THRESHOLD_GROWTH = 1.04;
const INCOME_PERCENTAGE_OVER_THRESHOLD = 0.09;
export const AVERAGE_INTEREST_RATE = 3.4;

export const defaultRowOptions: RowOptions = {
  averageSalaryGrowth: AVERAGE_SALARY_GROWTH,
  incomePercentageTaxedOverThreshold: INCOME_PERCENTAGE_OVER_THRESHOLD,
  averageInterestRate: AVERAGE_INTEREST_RATE,
  planInterestRate: 3,
  repaymentThresholdGrowth: REPAYMENT_THRESHOLD_GROWTH,
};
