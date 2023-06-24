import type { RowData } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { FormType } from "./LoanForm";
import { columns } from "./columns";
import { useEffect, useState } from "react";
import type { CalcOptions } from "../calc/projection";
import { calculateFullData } from "../calc/projection";
import { defaultRowOptions } from "../calc/defaultRowOptions";
import { RecalculateSubsequentRows } from "../calc/partialUpdate";
import { OptionsContext } from "../calc/defaultOptions";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TableMeta<TData extends RowData> {
    updateData: (
      rowIndex: number,
      columnId: string,
      value: number,
      options: CalcOptions
    ) => void;
  }
}

export type YearRow = {
  currentLoanYear: number;
  graduatingYear: number;
  salary: number;
  calendarYear: number;
  totalDebt: number;
  interestRate: number;
  annualInterest: number;
  repaymentThreshold: number;
  annualRepayment: number;
  totalRepaid: number;
  yearsUntilWiped: number;
};

export const LoanTable = (formInput: FormType) => {
  const options = {
    graduatingYear: formInput.graduatingYear,
    loanBalance: formInput.loanBalance,
    loanPeriod: 40,
    repaymentThreshold: 27295,
    salary: 30000,
    rowOptions: defaultRowOptions,
  };

  const tableData = calculateFullData([], options);

  return (
    <OptionsContext.Provider value={options}>
      <LoanTableGrid rows={...tableData} />
    </OptionsContext.Provider>
  );
};

const LoanTableGrid = (props: { rows: YearRow[] }) => {
  const [clientData, setClientData] = useState([...props.rows]);

  useEffect(() => {
    setClientData([...props.rows]);
  }, [props.rows]);

  const table = useReactTable({
    data: clientData,
    columns,
    getCoreRowModel: getCoreRowModel<YearRow>(),
    meta: {
      updateData: (
        rowIndex: number,
        columnId: string,
        value: number,
        options: CalcOptions
      ) => {
        setClientData(
          RecalculateSubsequentRows(
            [...clientData],
            rowIndex,
            columnId,
            value,
            options
          )
        );
      },
    },
  });

  return (
    <div className="overflow-hidden rounded-xl">
      <div
        className="block max-h-screen max-w-full overflow-auto rounded-lg border border-gray-300 bg-gray-50 px-2 text-gray-900 sm:text-sm"
        id="result"
      >
        <table className="mt-2 min-w-full divide-y divide-gray-200 sm:min-w-full">
          <thead className="sticky top-0 z-10 bg-gray-50 text-center align-bottom text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-6">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="whitespace-nowrap pb-2 text-center text-sm sm:mx-6 md:mx-12"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            {table.getFooterGroups().map((footerGroup) => (
              <tr key={footerGroup.id}>
                {footerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.footer,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </tfoot>
        </table>
      </div>
    </div>
  );
};
