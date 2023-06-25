import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Label,
  Legend,
} from "recharts";

import React from "react";
import { formatCurrency } from "../../utils/formatCurrency";
import type { YearRow, YearRowLabels } from "../LoanProjection";

type LineGraphProps<T, U> = {
  data: T[];
  independentVariable: keyof T extends string ? keyof T : never;
  series: (keyof T)[];
  labels: (U[keyof U] | "Real Salary" | "Real Repayment")[];
  width: 50 | 100;
  title: string;
};

export function LineGraph<
  T extends Partial<YearRow>,
  U extends Partial<YearRowLabels>
>({
  data,
  independentVariable,
  series,
  labels,
  width,
  title,
}: LineGraphProps<T, U>) {
  const COLOURS = ["#8884d8", "#82ca9d"];

  return (
    <div
      className={
        width === 100
          ? "w-full p-4 text-gray-900"
          : "w-full p-4 text-gray-900 sm:w-1/2"
      }
    >
      <h2 className="text-center text-lg font-bold">{title}</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          width={600}
          height={400}
          data={data}
          margin={{ top: 5, right: 20, bottom: 20, left: 20 }}
        >
          {series.map((serie) => (
            <Line
              key={serie.toString()}
              name={labels[series.indexOf(serie)]}
              type="monotone"
              dataKey={`${serie.toString()}`}
              stroke={COLOURS.pop()}
            />
          ))}
          <XAxis
            dataKey={independentVariable}
            padding={{ left: 10, right: 10 }}
          >
            <Label value="Year" offset={0} position="bottom" />
          </XAxis>
          <YAxis tickFormatter={(value: number) => `£${value}`} />
          <Tooltip
            wrapperClassName="rounded-md"
            labelClassName="font-bold"
            formatter={(num: number) => formatCurrency(num)}
          />
          <Legend verticalAlign="top" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
