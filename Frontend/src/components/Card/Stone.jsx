import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import MobileFilter from "../filters/MobileFilter";
import DesktopFilter from "../filters/DesktopFilter";



function Stone() {
  const [products, setProducts] = useState([]);


  /* -------- FILTER STATES -------- */
 const [filters, setFilters] = useState({
  category: "All",
  availability: "all",
  sort: "default",
  minPrice: "",
  maxPrice: "",
});
  /* -------- PAGINATION -------- */
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  const categories = [
    "All",
    ...new Set(products.map((item) => item.category).filter(Boolean)),
  ];
  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
    fetch("http://localhost:8080/api/stone")
      .then(res => res.json())
      .then(data => setProducts(data));

   const user = JSON.parse(localStorage.getItem("user"));
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);
  /* ---------------- ADD TO CART ---------------- */
const addToCart = (product) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    alert("Please login first");
    return;
  }

  const cartKey = `cart_${user._id}`;

  let cart =
    JSON.parse(localStorage.getItem(cartKey)) || [];

  const existingIndex = cart.findIndex(
    (item) => item._id === product._id
  );

  if (existingIndex !== -1) {
    cart[existingIndex] = {
      ...cart[existingIndex],
      quantity: cart[existingIndex].quantity + 1,
    };
  } else {
    cart.push({
      ...product,
      quantity: 1,
    });
  }

  localStorage.setItem(
    cartKey,
    JSON.stringify(cart)
  );

  window.dispatchEvent(
    new Event("cartUpdated")
  );

  alert("Added to cart 🛒");
};



  /* ---------------- FILTER LOGIC ---------------- */
  let filteredProducts = [...products];

  // availability
  if (filters.availability === "inStock") {
  filteredProducts = filteredProducts.filter(
    p => p.stockquantity > 0
  );
}

if (filters.availability === "outStock") {
  filteredProducts = filteredProducts.filter(
    p => p.stockquantity <= 0
  );
}
  if (filters.category !== "All") {
    filteredProducts = filteredProducts.filter(
      (p) =>
        p.category?.toLowerCase() === filters.category.toLowerCase()
    );
  }
  // price filter
  filteredProducts = filteredProducts.filter(p => {
    return (
      ( filters.minPrice === "" || p.price >= Number(filters.minPrice)) &&
      ( filters.maxPrice === "" || p.price <= Number(filters.maxPrice))
    );
  });

  // sorting
  if (filters.sort === "low") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (filters.sort === "high") {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (filters.sort === "az") {
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  } else if (filters.sort === "za") {
    filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
  }

  /* -------- PAGINATION -------- */
  const lastIndex = currentPage * productsPerPage;
  const firstIndex = lastIndex - productsPerPage;

  const currentProducts = filteredProducts.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    <div className="max-w-7xl mx-auto mt-16 px-4 ">

      {/* 🔥 FILTER BAR */}
      {/* 🔥 FILTER BAR (NECKLACE STYLE) */}
      {/* 🔥 FILTER BAR (UPDATED) */}
      <DesktopFilter
  filters={filters}
  setFilters={setFilters}
  categories={categories}
  totalProducts={filteredProducts.length}
/>
      <MobileFilter

filters={filters}

setFilters={setFilters}

categories={categories}

totalProducts={
filteredProducts.length
}

/>
     
      {/* PRODUCT GRID */}
     <div
  className="max-w-7xl mx-auto grid grid-cols-2  md:grid-cols-3 lg:grid-cols-4 gap-4"
>

        {currentProducts.map((item) => (

          <div
            key={item._id}
           className="
    bg-[#f5f5f5]
    rounded-md
    shadow-md
    hover:shadow-md
    border
    border-gray-300
    transition
    duration-300
    overflow-hidden
    group
    md:min-h-[400px]
    relative
  "
          >

           {(item.soldOut || item.stockquantity <= 0) && (
  <span
     className="
  absolute
  left-3
  top-[120px]
  md:left-5
  md:top-[190px]
  bg-red-600
  text-white
  text-[10px]
  md:text-sm
  px-3
  py-1
  rounded-full
  z-20
"
  >
    Sold Out
  </span>
)}

            

            <Link to={`/product/stone/${item._id}`}>
              <div className="p-6 flex justify-center items-center">
                <div
   className="
       w-[110px]
h-[110px]
md:w-[240px]
md:h-[240px]
        rounded-full
        bg-white
        flex
        justify-center
        items-center
        shadow-inner
        overflow-hidden
      "
>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="
         w-[70px]
h-[70px]
md:w-[160px]
md:h-[160px]
          object-contain
          group-hover:scale-110
          transition-all
          duration-300
        "
                  />
                </div>
              </div>
            </Link>

            <div className="p-4 text-start">
              <h3 className="font-semibold mb-2">{item.name}</h3>
              <p className="text-lg font-semibold mb-3">
                PKR.{Number(item.price).toLocaleString()}
              </p>

             
            </div>

          </div>

        ))}

      </div>

      {/* PAGINATION (UNCHANGED) */}
      <div className="flex justify-center items-center gap-2 mt-12">

        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-2 bg-gray-200 rounded"
        >
          ←
        </button>

        {[...Array(totalPages)].map((_, index) => {
          const page = index + 1;

          return (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded-full border transition-all duration-300 ${currentPage === page
                ? "bg-gradient-to-r from-[#092805] to-[#224225] text-white scale-110 shadow"
                : "bg-white hover:bg-gradient-to-r from-[#092805] to-[#224225] hover:text-white"
                }`}
            >
              {page}
            </button>
          );
        })}

        <button
          onClick={() =>
            setCurrentPage(prev => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-3 py-2 bg-gray-200 rounded"
        >
          →
        </button>

      </div>

    </div>
  );
}

export default Stone;