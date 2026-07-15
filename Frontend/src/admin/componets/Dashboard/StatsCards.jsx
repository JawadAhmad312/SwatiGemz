import { motion } from "framer-motion";

export default function StatsCards({ stats }) {
  const cards = [
    {
      title: "Revenue",
      value: `PKR.${stats?.revenue?.toLocaleString() || 0}`,
      change: `${stats?.growth || 0}%`,
      color:
        stats?.growth >= 0 ? "text-green-500" : "text-red-500",
    },
    {
      title: "Orders",
      value: stats?.orders || 0,
    },
    {
      title: "Products",
      value: stats?.totalProducts || 0,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-4 rounded-xl shadow"
        >
          <p className="text-gray-400 text-sm">{card.title}</p>

          <h2 className="text-xl font-bold">
            {card.value}
          </h2>

          {card.change && (
            <p className={`text-xs ${card.color}`}>
              {card.change}
            </p>
          )}
        </motion.div>
      ))}
    </div>
  );
}