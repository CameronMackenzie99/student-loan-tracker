import type { RowData } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { columns } from "./columns";
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useMemo, useState } from "react";
import type { CalcOptions, PreGradYearRow } from "../calc/projection";
import { calculateFullData } from "../calc/projection";
import {
  AVERAGE_SALARY_GROWTH,
  REPAYMENT_THRESHOLD_GROWTH,
  AVERAGE_INTEREST_RATE,
} from "../calc/defaultRowOptions";
import { RecalculateSubsequentRows } from "../calc/partialUpdate";
import { OptionsContext } from "../calc/defaultOptions";
import { LineGraph } from "./visualisations/LineGraph";
import { calculateRealValue } from "../utils/calculateRealValue";
import { planOptions } from "../calc/planOptions";
import type { FormDataType } from "./MultiStepForm";

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

export type YearRowLabels = {
  currentLoanYear: "Current Loan Year";
  graduatingYear: "Graduating Year";
  salary: "Salary";
  calendarYear: "Tax Year";
  totalDebt: "Total Debt";
  interestRate: "Interest Rate";
  annualInterest: "Annual Interest";
  repaymentThreshold: "Repayment Threshold";
  annualRepayment: "Annual Repayment";
  totalRepaid: "Total Repaid";
  yearsUntilWiped: "Years until Wiped";
};

export type YearRow = {
  [R in keyof YearRowLabels]: number;
};

type LoanProjectionProps = {
  formInput: FormDataType;
};

export const LoanProjection = ({ formInput }: LoanProjectionProps) => {
  const options: CalcOptions = useMemo(() => {
    return {
      graduatingYear:
        formInput.student === "graduate"
          ? formInput.data!.graduatingYear
          : formInput.data!.courseStartYear + formInput.data!.courseLength,
      loanPeriod: planOptions[formInput.plan].loanPeriod,
      repaymentThreshold: planOptions[formInput.plan].repaymentThreshold,
      salary: 30000,
      rowOptions: {
        averageSalaryGrowth: AVERAGE_SALARY_GROWTH,
        incomePercentageTaxedOverThreshold:
          planOptions[formInput.plan].incomePercentageTaxedOverThreshold,
        planInterestRate: planOptions[formInput.plan].interestRate,
        averageInterestRate: AVERAGE_INTEREST_RATE,
        repaymentThresholdGrowth: REPAYMENT_THRESHOLD_GROWTH,
      },
    };
  }, [formInput]);

  const tableData = useMemo(
    () => calculateFullData(formInput, options),
    [formInput, options]
  );

  const [clientData, setClientData] =
    useState<(YearRow | PreGradYearRow)[]>(tableData);

  useEffect(() => {
    setClientData(tableData);
  }, [tableData]);

  return (
    <OptionsContext.Provider value={options}>
      <LoanTableGrid rows={...clientData} setRows={setClientData} />
      <div className="mt-4 flex h-fit w-full flex-wrap rounded-lg border border-gray-300 bg-gray-50 ">
        <LineGraph
          data={clientData.map((row) => {
            return {
              calendarYear: row.calendarYear,
              totalDebt: row.totalDebt,
              totalRepaid: row.totalRepaid,
            };
          })}
          independentVariable="calendarYear"
          series={["totalDebt", "totalRepaid"]}
          labels={["Total Debt", "Total Repaid"]}
          width={100}
          title="Total Repaid and Loan Balance"
        />
        <LineGraph
          data={clientData.map((row) => {
            return {
              calendarYear: row.calendarYear,
              salary: row.salary,
              realSalary: row.salary
                ? calculateRealValue(row.salary, row.calendarYear)
                : undefined,
            };
          })}
          independentVariable="calendarYear"
          series={["salary", "realSalary"]}
          labels={["Salary", "Real Salary"]}
          width={50}
          title="Nominal vs Real Salary"
        />
        <LineGraph
          data={clientData.map((row) => {
            return {
              calendarYear: row.calendarYear,
              annualRepayment: row.annualRepayment,
              realRepayment: row.annualRepayment
                ? calculateRealValue(row.annualRepayment, row.calendarYear)
                : undefined,
            };
          })}
          independentVariable="calendarYear"
          series={["annualRepayment", "realRepayment"]}
          labels={["Annual Repayment", "Real Repayment"]}
          width={50}
          title="Nominal vs Real Repayments"
        />
      </div>
    </OptionsContext.Provider>
  );
};

const LoanTableGrid = ({
  rows,
  setRows,
}: {
  rows: (YearRow | PreGradYearRow)[];
  setRows: Dispatch<SetStateAction<(YearRow | PreGradYearRow)[]>>;
}) => {
  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel<YearRow | PreGradYearRow>(),
    meta: {
      updateData: (
        rowIndex: number,
        columnId: string,
        value: number,
        options: CalcOptions
      ) => {
        setRows(
          RecalculateSubsequentRows(
            [...rows],
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
        className="block max-h-screen max-w-full overflow-auto rounded-md border border-gray-300 bg-gray-50 px-2 text-gray-900 sm:text-sm"
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
