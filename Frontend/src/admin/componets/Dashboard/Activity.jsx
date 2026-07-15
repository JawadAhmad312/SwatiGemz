export default function Activity() {
  const activities = [
    "New order placed",
    "Payment updated",
    "Inventory synced",
    "New user registered",
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="font-semibold mb-4">Recent Activity</h2>

      {activities.map((item, i) => (
        <div key={i} className="flex gap-3 mb-3">
          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
          <p className="text-sm text-gray-500">{item}</p>
        </div>
      ))}
    </div>
  );
}