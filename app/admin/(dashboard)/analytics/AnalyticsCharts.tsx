"use client";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const tickStyle = { fontSize: 11, fill: "#86868b" };
const tooltipStyle = {
  fontSize: 12,
  borderRadius: 8,
  border: "1px solid #e5e5ea",
};

export function TrendChart({ data }: { data: { date: string; count: number }[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e5ea" />
          <XAxis
            dataKey="date"
            tick={tickStyle}
            tickFormatter={(d: string) => d.slice(5)}
            minTickGap={24}
          />
          <YAxis tick={tickStyle} allowDecimals={false} width={30} />
          <Tooltip contentStyle={tooltipStyle} />
          <Line
            type="monotone"
            dataKey="count"
            name="Pageviews"
            stroke="#0066cc"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function BarListChart({ data }: { data: { label: string; count: number }[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e5ea" horizontal={false} />
          <XAxis type="number" tick={tickStyle} allowDecimals={false} />
          <YAxis
            type="category"
            dataKey="label"
            tick={{ fontSize: 12, fill: "#1d1d1f" }}
            width={100}
          />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey="count" fill="#0066cc" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
