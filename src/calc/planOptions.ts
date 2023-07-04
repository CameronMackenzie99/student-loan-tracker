type Plan = {
  loanPeriod: number;
  repaymentThreshold: number;
  incomePercentageTaxedOverThreshold: number;
  interestRate: number;
};

type PlanOptions = Record<string, Plan>;

export const planOptions = {
  plan1: {
    // wiped at age 65 if first loan for course took out before 1 sept 2006
    loanPeriod: 25,
    repaymentThreshold: 22015,
    incomePercentageTaxedOverThreshold: 0.09,
    interestRate: 5.5,
  },
  plan2: {
    loanPeriod: 30,
    repaymentThreshold: 27295,
    incomePercentageTaxedOverThreshold: 0.09,
    interestRate: 7.1,
  },
  plan3: {
    loanPeriod: 30,
    repaymentThreshold: 21000,
    incomePercentageTaxedOverThreshold: 0.06,
    interestRate: 7.1,
  },
  plan4: {
    // wiped at age 65 if academic year took out loan is 2006-2007 or earlier, or 30 years after April due to start paying - whichever comes first
    loanPeriod: 30,
    repaymentThreshold: 27660,
    incomePercentageTaxedOverThreshold: 0.09,
    interestRate: 5.5,
  },
  plan5: {
    loanPeriod: 40,
    repaymentThreshold: 25000,
    incomePercentageTaxedOverThreshold: 0.09,
    interestRate: 3,
  },
} as const satisfies PlanOptions;
