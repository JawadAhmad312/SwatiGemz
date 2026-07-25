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
   className="mt-10 max-w-7xl mx-auto px-3 
  grid grid-cols-2 lg:grid-cols-4
  gap-3 sm:gap-6              /* inner spacing */
    md:min-h-[500px]  "
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
        h-[280px]
        w-full
        max-w-[300px]     /* card width */
        md:h-[420px]         /* card height */
        mx-auto           /* center card in grid cell */
        md:flex md:flex-col
      "
    >
      {/* Image Section */}
    <div className="w-full h-[250px] flex items-center justify-center p-4" className="relative w-full h-[170px] sm:h-[280px]
  bg-gray-50 flex items-center justify-center
  p-3 sm:p-4">

  <div
     className="relative   md:w-[220px]
      md:h-[220px] 
     bg-white rounded-full flex items-center justify-center
     p-3 sm:p-4   overflow-hidden
      shadow-sm"
  >
    <img
      src={item.image}
      alt={item.name}
      className="h-[90px] sm:h-[150px]
          w-auto object-contain transition-transform
          duration-300 group-hover:scale-105 "
    />
  </div>

</div>

      {/* Text Section */}
      <div className="p-3 sm:p-5 text-start">
        <h3   className="text-[14px] sm:text-lg
          font-semibold text-gray-900
          group-hover:text-black
          leading-[20px] sm:leading-normal
          line-clamp-2 min-h-[42px]">
          {item.name} - {item.weight}crt
        </h3>

        <p className="mt-2 text-gray-600 text-[13px] sm:text-[15px]">
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