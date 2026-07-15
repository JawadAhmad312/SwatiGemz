import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

function Womencategory() {
  const [Category, setCategory] = useState([]);
  const scrollRef = useRef(null);

  // Fetch backend data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/women");
        if (!res.ok) throw new Error("Failed to fetch data");
        const data = await res.json();
        setCategory(data);
      } catch (err) {
        console.log("Error Data Fetching:", err);
      }
    };
    fetchData();
  }, []);

  // Scroll Left Manually
  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -250, behavior: "smooth" });
  };

  // Scroll Right Manually
  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 250, behavior: "smooth" });
  };

  // ⭐ AUTO SLIDE
  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollBy({ left: 250, behavior: "smooth" });

        // reset to start if end reached
        if (
          scrollRef.current.scrollLeft + scrollRef.current.clientWidth >=
          scrollRef.current.scrollWidth - 5
        ) {
          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
        }
      }
    }, 4000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="mt-[1.5rem] md:mt-[3rem] mb-[2rem] md:mb-[4rem]">
        <h1 className="pt-2 text-center text-3xl md:text-5xl abril-fatface-regular">
          Top Women Rings
        </h1>

        {/* Carousel */}
        <div className="relative w-full mt-5 md:mt-14">

          {/* Left Button */}
          <button
            onClick={scrollLeft}
            className="absolute left-4 top-1/2 -translate-y-1/2 shadow-md h-8 w-8 md:h-12 md:w-12 
            flex items-center justify-center rounded-full hover:bg-gray-100 z-10 text-xl md:text-2xl"
          >
            &#8592;
          </button>

          {/* Scroll Container */}
          <div
            ref={scrollRef}
            className="
    flex
    gap-4 sm:gap-6 md:gap-10
    overflow-x-auto
    scroll-smooth
    scrollbar-hide
    px-4 sm:px-6 md:px-10
    py-6
    mx-auto
    w-full sm:w-[95%] md:w-[85%]
  "
          >
            {Category.slice(0, 10).map((item) => (
              <Link
                to={`/product/womenrings/${item._id}`}
                state={{ item }}
                key={item._id}
                className="group flex flex-col items-center flex-shrink-0"
              >
               <div
  className="
    relative
    w-[90px] h-[90px]
    sm:w-[120px] sm:h-[120px]
    md:w-[160px] md:h-[160px]
    bg-white
    rounded-full
    shadow-md
    overflow-hidden
    flex items-center justify-center
    hover:shadow-xl hover:-translate-y-1
    transition-all duration-300
  "
>

  {/* SOLD OUT */}
  {(item.soldOut || item.stockquantity <= 0) && (
    <span
      className="
        absolute
        bottom-1
        left-1/2
        -translate-x-1/2
        bg-red-600
        text-white
        text-[8px]
        sm:text-[10px]
        px-2
        sm:px-3
        py-1
        rounded-full
        z-20
        shadow-lg
        whitespace-nowrap
      "
    >
      Sold out
    </span>
  )}
                  <img
                    src={item.mainimages}
                    alt={item.title}
                    className="
          w-full h-full
          object-cover
          group-hover:scale-110
          transition-transform duration-300
        "
                  />
                </div>

                <h3 className="mt-2 text-xs sm:text-sm md:text-lg font-medium text-gray-800 text-center">
                  {item.title.split(" ").slice(0, 2).join(" ")}
                </h3>
              </Link>
            ))}

          </div>

          {/* Right Button */}
          <button
            onClick={scrollRight}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white shadow-md h-8 w-8 md:h-12 md:w-12 
            flex items-center justify-center rounded-full hover:bg-gray-100 z-10 text-xl md:text-2xl"
          >
            &rarr;
          </button>
        </div>
      </div>
    </>
  );
}

export default Womencategory;
