import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface RevenueChartProps {
  data: {
    month: string;
    amount: number;
  }[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
        <Tooltip
          formatter={(value) => [
            `$${(value as number).toLocaleString()}`,
            "Revenue",
          ]}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="amount"
          name="Revenue"
          stroke="#1a75ea"
          activeDot={{ r: 8 }}
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
