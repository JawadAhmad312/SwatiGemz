import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ProductChart({ data }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="font-semibold mb-4">Product Sales</h2>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="_id" />
          <Tooltip />
          <Bar
            dataKey="totalSold"
            fill="#3b82f6"
            animationDuration={800}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}