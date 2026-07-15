import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#06B6D4",
  "#84CC16"
];

export default function DonutChart({
  rings = 0,
  women = 0,
  necklaces = 0,
  earrings = 0,
  stones = 0,
  gemstones = 0,
  collections = 0
}) {

  const data = [

    {
      name: "Men Rings",
      value: rings
    },

    {
      name: "Women Rings",
      value: women
    },

    {
      name: "Necklaces",
      value: necklaces
    },

    {
      name: "Earrings",
      value: earrings
    },

    {
      name: "Stones",
      value: stones
    },

    {
      name: "Gemstones",
      value: gemstones
    },

    {
      name: "Collections",
      value: collections
    }
  ];

  const total =
    rings +
    women +
    necklaces +
    earrings +
    stones +
    gemstones +
    collections;

  return (

    <div className="bg-white rounded-2xl shadow-lg p-6">

      <div className="flex justify-between items-center mb-4">

        <h2 className="text-lg font-bold">
          Product Distribution
        </h2>

        <span className="text-gray-500">
          Total: {total}
        </span>

      </div>

      <div className="h-[350px] relative">

        <ResponsiveContainer>

          <PieChart>

            <Pie
              data={data}
              dataKey="value"
              innerRadius={80}
              outerRadius={120}
            >

              {data.map((entry, index) => (

                <Cell
                  key={index}
                  fill={
                    COLORS[index]
                  }
                />

              ))}

            </Pie>

            <Tooltip />

            <Legend />

          </PieChart>

        </ResponsiveContainer>

        <div
          className="
          absolute
          top-1/2
          left-1/2
          -translate-x-1/2
          -translate-y-1/2
          text-center
        "
        >

          <h3 className="text-3xl font-bold">
            {total}
          </h3>

          <p className="text-gray-500">
            Products
          </p>

        </div>

      </div>

    </div>
  );
}