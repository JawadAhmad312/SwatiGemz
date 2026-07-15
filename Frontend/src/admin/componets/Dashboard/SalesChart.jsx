import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
} from "recharts";
import { useEffect, useState } from "react";

export default function SalesReport() {
  const [data, setData] = useState([]);
  const [range, setRange] = useState("monthly");

  useEffect(() => {
    fetch(`http://localhost:8080/admin/sales-chart?range=${range}`,{
    credentials: "include",
  })
      .then((res) => res.json())
      .then((d) => setData(d || []))
      .catch(() => setData([]));
  }, [range]);

const safeData = Array.isArray(data) ? data : [];

const totalRevenue = safeData.reduce(
  (a, b) => a + (b.revenue || 0),
  0
);

const totalOrders = safeData.reduce(
  (a, b) => a + (b.orders || 0),
  0
);

  // Optional: simple growth placeholder (replace with real calc if needed)
  const growth = 25.3;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white shadow-lg rounded-lg p-3 border text-sm">
          <p className="font-medium mb-1">{label}</p>
          <p className="flex items-center gap-2 text-indigo-500">
            <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
            Total Revenue: {payload[0]?.value ?? 0}
          </p>
          <p className="flex items-center gap-2 text-green-500">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Orders: {payload[1]?.value ?? 0}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow w-full ">

      {/* HEADER */}
      <div className="flex justify-between items-center border-b px-6 py-4">
        <h2 className="font-semibold text-gray-700">
          Sales Report{" "}
          <span className="text-gray-400">({totalOrders} Orders)</span>
        </h2>

        <div className="flex gap-6 text-sm">
          {["today", "monthly", "annual"].map((t) => (
            <span
              key={t}
              onClick={() => setRange(t)}
              className={`cursor-pointer pb-1 capitalize ${
                range === t
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-400"
              }`}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 text-center bg-gray-50 py-5 border-b">
        <div>
          <p className="text-gray-400 text-sm">Revenue</p>
          <h3 className="font-bold text-lg text-gray-700">
            ${totalRevenue.toLocaleString()}
          </h3>
        </div>

        <div>
          <p className="text-gray-400 text-sm">Orders</p>
          <h3 className="font-bold text-lg text-gray-700">
            {totalOrders}
          </h3>
        </div>

        <div>
          <p className="text-gray-400 text-sm">Growth Rate</p>
          <h3 className="font-bold text-lg text-green-500">
            ↑ {growth}%
          </h3>
        </div>
      </div>

      {/* INFO TEXT */}
      <div className="px-6 pt-4">
        <p className="text-gray-700 font-medium">
          Today’s Earning: ${totalRevenue.toLocaleString()}
        </p>
        <p className="text-gray-400 text-sm mt-1">
          Property PS007 is not receiving hits. Either your site is not receiving any sessions.
        </p>
      </div>

      {/* CHART */}
      <div className="px-6 pb-6 mt-2 w-full">
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={safeData}>
            {/* GRID */}
            <CartesianGrid strokeDasharray="6 6" />

            {/* GRADIENT */}
            <defs>
              <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7c6cff" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#7c6cff" stopOpacity={0} />
              </linearGradient>
            </defs>

            <XAxis dataKey="day" tick={{ fontSize: 12 }} />

            <Tooltip content={<CustomTooltip />} />

            {/* AREA */}
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="none"
              fill="url(#revGradient)"
            />

            {/* REVENUE LINE */}
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#7c6cff"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
              animationDuration={800}
            />

            {/* ORDERS LINE (DASHED) */}
            <Line
              type="monotone"
              dataKey="orders"
              stroke="#22c55e"
              strokeWidth={2}
              strokeDasharray="6 6"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>

        {/* LEGEND */}
        <div className="flex justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
            Total Revenue
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            Orders
          </div>
        </div>
      </div>
    </div>
  );
}
