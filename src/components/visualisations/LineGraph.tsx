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

export function LineGraph<T>(props: { data: T[] }) {
  return (
    <div className="mt-4 h-screen w-full rounded-lg border border-gray-300 bg-gray-50 p-4 text-gray-900">
      <h2 className="text-center text-lg font-bold">
        Loan balance and total repaid
      </h2>
      <ResponsiveContainer width="100%" height="50%">
        <LineChart
          width={600}
          height={400}
          data={props.data}
          margin={{ top: 5, right: 20, bottom: 20, left: 20 }}
        >
          <Line
            name="Loan Balance"
            type="monotone"
            dataKey="totalDebt"
            stroke="#8884d8"
          />
          <Line
            name="Total Repaid"
            type="monotone"
            dataKey="totalRepaid"
            stroke="#82ca9d"
          />
          <XAxis dataKey="calendarYear" padding={{ left: 10, right: 10 }}>
            <Label value="Year" offset={0} position="bottom" />
          </XAxis>
          <YAxis tickFormatter={(value: number) => `£${value}`} />
          <Tooltip formatter={(num: number) => formatCurrency(num)} />
          <Legend verticalAlign="top" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
