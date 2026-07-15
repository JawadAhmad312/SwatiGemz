export default function SalesTicker({ data }) {
  return (
    <div className="bg-black text-white p-2 overflow-hidden rounded-xl">
      <div className="flex gap-10 animate-marquee">
        {data.map((p, i) => (
          <span key={i}>
            {p._id} ↑ {p.totalSold}
          </span>
        ))}
      </div>
    </div>
  );
}