import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface EnrollmentChartProps {
  data: {
    courseName: string;
    count: number;
  }[];
}

export function EnrollmentChart({ data }: EnrollmentChartProps) {
  // Truncate long course names for display
  const formattedData = data.map((item) => ({
    ...item,
    displayName:
      item.courseName.length > 20
        ? `${item.courseName.substring(0, 20)}...`
        : item.courseName,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={formattedData}
        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="displayName"
          angle={-45}
          textAnchor="end"
          height={80}
          tick={{ fontSize: 12 }}
        />
        <YAxis />
        <Tooltip
          formatter={(value) => [`${value} enrollments`, "Enrollments"]}
          labelFormatter={(label) => {
            const course = data.find((item) =>
              item.courseName.startsWith(label.replace("...", ""))
            );
            return course?.courseName || label;
          }}
        />
        <Legend />
        <Bar dataKey="count" name="Enrollments" fill="#1a75ea" />
      </BarChart>
    </ResponsiveContainer>
  );
}
