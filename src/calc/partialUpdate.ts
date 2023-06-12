import type { YearRow } from "../components/LoanTable";
import type { CalcOptions } from "./projection";
import { calculateFullData } from "./projection";

export const RecalculateSubsequentRows = (
  oldRows: YearRow[],
  changedRowIndex: number,
  columnId: string,
  value: number,
  options: CalcOptions
) => {
  const changedRow = {
    ...oldRows[changedRowIndex],
    [columnId]: value,
  } as YearRow;

  const recalculatedRows = calculateFullData([changedRow], options);

  const unchangedRows = oldRows.slice(0, changedRowIndex);

  return unchangedRows.concat(recalculatedRows);
};
