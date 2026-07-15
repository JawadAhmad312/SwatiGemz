import React from 'react'
import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';





function Card() {
  const [listings, setListings] = useState([]);
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/stone"); // 👈 your API URL
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await res.json();
        setListings(data);         // save data in state
      } catch (err) {
        setError(err.message);
      }
    };

    fetchListings();
  }, []);
  return (
    <>
  <div
  className="
    max-w-7xl          /* container width */
    mx-auto            /* center horizontally */
    mt-16
    grid
    lg:grid-cols-4
    md:grid-cols-2
    sm:grid-cols-1
    gap-4
    px-6               /* inner spacing */
    min-h-[500px]      /* container height (optional) */
  "
>
  {listings
  .filter(item => item.stockquantity > 0)
  .slice(0, 4)
  .map((item) => (
    <Link
     to={`/product/stone/${item._id}`}
      state={{ item }}
      key={item._id}
      className="
        group
        bg-[#f5f5f5]
        rounded-md
        border border-gray-300
        shadow-sm
        hover:shadow-xl
        hover:-translate-y-1
        transition-all duration-300
        overflow-hidden

        w-full
        max-w-[300px]     /* card width */
        h-[420px]         /* card height */
        mx-auto           /* center card in grid cell */
        flex flex-col
      "
    >
      {/* Image Section */}
    <div className="w-full h-[250px] flex items-center justify-center p-4">

  <div
    className="
      w-[220px]
      h-[220px]
      rounded-full
      bg-white
      flex
      items-center
      justify-center
      overflow-hidden
      shadow-sm
    "
  >
    <img
      src={item.image}
      alt={item.name}
      className="
        w-[170px]
        h-[170px]
        object-contain
        group-hover:scale-110
        transition-all
        duration-300
      "
    />
  </div>

</div>

      {/* Text Section */}
      <div className="p-5 text-start flex-grow flex flex-col justify-end">
        <h3 className="font-semibold text-gray-800 text-lg mb-2 line-clamp-2">
          {item.name} - {item.weight}crt
        </h3>

        <p className="text-lg font-semibold text-gray-900 mb-3">
          Rs.{new Intl.NumberFormat("en-PK").format(item.price)} PKR
        </p>
      </div>
    </Link>
  ))}
</div>






    </>
  )
}

export default Card