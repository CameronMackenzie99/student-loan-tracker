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
  };

  return (
    <div className="flex justify-center">
      <div className="relative flex rounded-md py-2 shadow-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
          <span className="visible text-gray-500 sm:text-sm">£</span>
        </div>
        <input
          type="number"
          value={value.toFixed(0)}
          onChange={(e) => setValue(parseInt(e.target.value))}
          onBlur={onBlur}
          className="min-w-20 w-20 rounded-md border-0 pl-5 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 [appearance:textfield] placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[hsl(216,92%,76%)] sm:py-1.5"
        />
      </div>
    </div>
  );
};
