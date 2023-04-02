import type { FormType } from "../../../pages";
import { FormSchema } from "../../../pages";

import { createTRPCRouter, publicProcedure } from "../trpc";

export type YearRow = {
  currentLoanYear: number;
  graduatingYear: number;
  adjustedSalary: number;
  calendarYear: number;
  totalDebt: number;
  interestRate: number;
  annualInterest: number;
  repaymentThreshold: number;
  annualRepayment: number;
  totalRepaid: number;
  yearsUntilWiped: number;
};

type CalcYearData = (row: YearRow, result: YearRow[]) => CalcYearData | null;

const YEARS_UNTIL_WIPED = 30;
const AVERAGE_SALARY_GROWTH = 1.03;
const REPAYMENT_THRESHOLD_GROWTH = 1.03;
const INCOME_PERCENTAGE_OVER_THRESHOLD = 0.09;
const INTEREST_RATE = 6.9;
const REPAYMENT_THRESHOLD = 27295;
const STARTING_SALARY = 30000;

function calculateYearData(
  prevYearRow: YearRow,
  result: YearRow[]
): CalcYearData | null {
  if (prevYearRow.yearsUntilWiped === 0 || prevYearRow.totalDebt === 0) {
    return null;
  }

  const calendarYear = prevYearRow.calendarYear + 1;
  const yearsUntilWiped = prevYearRow.yearsUntilWiped - 1;
  const annualInterest =
    prevYearRow.totalDebt * (prevYearRow.interestRate / 100);

  let annualRepayment: number;
  if (prevYearRow.adjustedSalary < prevYearRow.repaymentThreshold) {
    annualRepayment = 0;
  } else {
    const maxRepayment =
      (prevYearRow.adjustedSalary - prevYearRow.repaymentThreshold) *
      INCOME_PERCENTAGE_OVER_THRESHOLD;

    annualRepayment =
      prevYearRow.totalDebt + prevYearRow.annualInterest - maxRepayment < 0
        ? prevYearRow.totalDebt
        : maxRepayment;
  }

  const returnRow: YearRow = {
    currentLoanYear:
      prevYearRow.graduatingYear > calendarYear
        ? 0
        : calendarYear - prevYearRow.graduatingYear,
    graduatingYear: prevYearRow.graduatingYear,
    adjustedSalary: prevYearRow.adjustedSalary * AVERAGE_SALARY_GROWTH,
    calendarYear: calendarYear,
    totalDebt: Math.max(
      prevYearRow.totalDebt +
        prevYearRow.annualInterest -
        prevYearRow.annualRepayment,
      0
    ),
    interestRate: prevYearRow.interestRate,
    annualInterest: annualInterest,
    repaymentThreshold:
      prevYearRow.repaymentThreshold * REPAYMENT_THRESHOLD_GROWTH,
    annualRepayment: annualRepayment,
    totalRepaid: prevYearRow.totalRepaid + annualRepayment,
    yearsUntilWiped: yearsUntilWiped,
  };

  result.push(returnRow);
  return calculateYearData(returnRow, result);
}

function calculateFullData(input: FormType) {
  const currentYear = new Date().getFullYear();
  const yearsUntilWiped =
    YEARS_UNTIL_WIPED -
    (currentYear - input.graduatingYear >= 0
      ? currentYear - input.graduatingYear
      : 0);

  const result: YearRow[] = [];

  calculateYearData(
    {
      currentLoanYear: 30 - yearsUntilWiped,
      graduatingYear: input.graduatingYear,
      adjustedSalary: STARTING_SALARY,
      calendarYear: currentYear,
      totalDebt: input.loanBalance,
      interestRate: INTEREST_RATE,
      annualInterest: 0,
      repaymentThreshold: REPAYMENT_THRESHOLD,
      annualRepayment: 0,
      totalRepaid: 0,
      yearsUntilWiped: yearsUntilWiped,
    },
    result
  );
  return result;
}

export const modellingRouter = createTRPCRouter({
  modelLoanValue: publicProcedure.input(FormSchema).query(({ input }) => {
    return calculateFullData(input);
  }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),
});
