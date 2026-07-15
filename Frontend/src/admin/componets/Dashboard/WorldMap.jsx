export default function WorldMap() {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="font-semibold mb-4">Revenue by Location</h2>

      <div className="relative">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg"
          className="w-full opacity-80"
        />

        {/* Dynamic markers */}
        <div className="absolute top-[40%] left-[60%] w-3 h-3 bg-blue-500 rounded-full animate-ping"></div>
        <div className="absolute top-[50%] left-[30%] w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
      </div>
    </div>
  );
}