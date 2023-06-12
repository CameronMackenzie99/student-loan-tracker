import { useContext, useEffect, useState } from "react";
import type { CellContext } from "@tanstack/react-table";
import type { YearRow } from "./LoanTable";
import { OptionsContext } from "../calc/defaultOptions";

export const EditableCell = ({
  getValue,
  row: { index },
  column: { id },
  table,
}: CellContext<YearRow, number>) => {
  const initialValue = getValue();
  const [value, setValue] = useState(0);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const options = useContext(OptionsContext);

  const onBlur = () => {
    table.options.meta?.updateData(index, id, value, options);
    console.log("meta value", value);
  };

  return (
    <input
      type="number"
      value={value.toFixed(0)}
      onChange={(e) => setValue(parseInt(e.target.value))}
      onBlur={onBlur}
    />
  );
};
