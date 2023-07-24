import type { YearRow } from "../components/LoanProjection";
import type { CalcOptions, PreGradYearRow, RowInputs } from "./projection";
import { calculateSubsequentRows, recalculateEditedRow } from "./projection";

export const RecalculateSubsequentRows = (
  oldRows: (YearRow | PreGradYearRow)[],
  changedRowIndex: number,
  columnId: string,
  value: number,
  options: CalcOptions
) => {
  const changedRow = {
    ...oldRows[changedRowIndex],
    [columnId]: value,
  } as YearRow;

  let rowInputs: RowInputs;
  if (changedRowIndex === 0) {
    rowInputs = {
      totalDebt: changedRow.totalDebt,
      interestRate: changedRow.interestRate,
      annualRepayment: 0,
      totalRepaid: 0,
    };
  } else {
    const prevRow = oldRows[changedRowIndex - 1];
    // will always be defined, if else block to satisfy compiler without using !
    if (prevRow !== undefined) {
      const {
        totalDebt,
        interestRate,
        annualRepayment = 0,
        totalRepaid = 0,
      } = prevRow;
      rowInputs = { totalDebt, interestRate, annualRepayment, totalRepaid };
    } else {
      throw new Error("Previous row is undefined");
    }
  }
  const recalculatedRow = recalculateEditedRow(changedRow, rowInputs, options);
  const unchangedRows = oldRows.slice(0, changedRowIndex);
  const rowCountToRecalculate = oldRows.length - unchangedRows.length;
  const recalculatedRows = calculateSubsequentRows(
    rowCountToRecalculate,
    options,
    [recalculatedRow]
  );

  return unchangedRows.concat(recalculatedRows);
};
