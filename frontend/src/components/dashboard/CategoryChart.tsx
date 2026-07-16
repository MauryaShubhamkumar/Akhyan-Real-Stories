import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  data: {
    name: string;
    value: number;
  }[];
}

export default function CategoryChart({ data }: Props) {
  return (
    <div className="h-[300px] w-full rounded-2xl border border-border bg-surface p-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <XAxis
            dataKey="name"
            stroke="var(--muted)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="var(--muted)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip
            cursor={{ fill: "var(--paper)", opacity: 0.4 }}
            contentStyle={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--border)",
              borderRadius: "0.75rem",
              color: "var(--ink)",
              fontSize: "12px",
            }}
          />
          <Bar
            dataKey="value"
            fill="#3b82f6"
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
