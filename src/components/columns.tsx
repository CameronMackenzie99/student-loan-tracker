import { createColumnHelper } from "@tanstack/react-table";
import { EditableCell } from "./EditableCell";
import { formatCurrency } from "../utils/formatCurrency";
import { formatTaxYear } from "../utils/formatTaxYear";
import type { YearRow } from "./LoanProjection";
import type { PreGradYearRow } from "@/calc/projection";

const columnHelper = createColumnHelper<YearRow | PreGradYearRow>();

export const columns = [
  columnHelper.accessor("currentLoanYear", {
    header: () => "Loan Year",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("calendarYear", {
    header: () => "Tax Year",
    cell: (info) => formatTaxYear(info.getValue()),
  }),
  columnHelper.accessor("salary", {
    header: () => "Salary",
    cell: EditableCell,
  }),
  columnHelper.accessor("interestRate", {
    header: () => "Interest Rate",
    cell: (info) => `${info.getValue()} %`,
  }),
  columnHelper.accessor("totalDebt", {
    header: () => "Total Debt",
    cell: (info) => formatCurrency(info.getValue()),
  }),
  columnHelper.accessor("annualInterest", {
    header: () => "Annual Interest",
    cell: (info) => formatCurrency(info.getValue()),
  }),
  columnHelper.accessor("repaymentThreshold", {
    header: () => "Repayment Threshold",
    cell: (info) => formatCurrency(info.getValue()),
  }),
  columnHelper.accessor("annualRepayment", {
    header: () => "Annual Repayment",
    cell: (info) => formatCurrency(info.getValue()),
  }),
  columnHelper.accessor("totalRepaid", {
    header: () => "Total Repaid",
    cell: (info) => formatCurrency(info.getValue()),
  }),
  columnHelper.accessor("yearsUntilWiped", {
    header: () => "Years until wiped",
    cell: (info) => info.getValue(),
  }),
];
