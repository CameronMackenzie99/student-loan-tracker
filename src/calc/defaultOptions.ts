import { createContext } from "react";
import { defaultRowOptions } from "./defaultRowOptions";

const defaultOptions = {
  graduatingYear: 1999,
  loanBalance: 5000,
  loanPeriod: 30,
  repaymentThreshold: 27295,
  salary: 30000,
  rowOptions: defaultRowOptions,
};

export const OptionsContext = createContext(defaultOptions);
