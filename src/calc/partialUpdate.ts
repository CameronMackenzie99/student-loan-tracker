import type { YearRow } from "../components/LoanTable";
import type { CalcOptions, RowInputs } from "./projection";
import { calculateFullData, recalculateEditedRow } from "./projection";

export const RecalculateSubsequentRows = (
  oldRows: YearRow[],
  changedRowIndex: number,
  columnId: string,
  value: number,
  options: CalcOptions
) => {
  console.log("changedRowIndex", changedRowIndex);
  const changedRow = {
    ...oldRows[changedRowIndex],
    [columnId]: value,
  } as YearRow;

  console.log("changedRow", changedRow);

  let rowInputs: RowInputs;
  if (changedRowIndex === 0) {
    rowInputs = {
      totalDebt: options.loanBalance,
      interestRate: options.rowOptions.interestRate,
      annualRepayment: 0,
      totalRepaid: 0,
    };
  } else {
    const prevRow = oldRows[changedRowIndex - 1];
    // will always be defined, if else block to satify compiler without using !
    if (prevRow !== undefined) {
      const { totalDebt, interestRate, annualRepayment, totalRepaid } = prevRow;
      rowInputs = { totalDebt, interestRate, annualRepayment, totalRepaid };
    } else {
      throw new Error("Previous row is undefined");
    }
  }
  console.log("rowinputs", rowInputs);

  const recalculatedRow = recalculateEditedRow(changedRow, rowInputs, options);
  const recalculatedRows = calculateFullData([recalculatedRow], options);
  const unchangedRows = oldRows.slice(0, changedRowIndex);
  console.log("newRows", recalculatedRows, unchangedRows);

  return unchangedRows.concat(recalculatedRows);
};
