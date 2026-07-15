import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import DesktopFilter from "../filters/DesktopFilter";
import MobileFilter from "../filters/MobileFilter";

const Necklaces = () => {
  const [necklaces, setNecklaces] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [wishlist, setWishlist] = useState([]);

  const [filters, setFilters] = useState({
    category: "All",
    availability: "all",
    sort: "default",
    minPrice: "",
    maxPrice: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const categories = [
    "All",
    ...new Set(necklaces.map((item) => item.category).filter(Boolean)),
  ];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);
  /* ---------------- LOAD WISHLIST ---------------- */
 useEffect(() => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    setWishlist([]);
    return;
  }

  const wishlistKey = `wishlist_${user._id}`;

  const stored =
    JSON.parse(localStorage.getItem(wishlistKey)) || [];

  setWishlist(stored);
}, []);

  /* ---------------- CART ---------------- */
  const addToCart = (product) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    alert("Please login first");
    return;
  }

  const cartKey = `cart_${user._id}`;

  let cart =
    JSON.parse(localStorage.getItem(cartKey)) || [];

  const existing = cart.find(
    (item) => item._id === product._id
  );

  if (existing) {
    existing.quantity += 1;
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

 
  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    const fetchNecklaces = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/necklace");
        const json = await res.json();

        const safeArray = Array.isArray(json)
          ? json
          : Array.isArray(json?.data)
            ? json.data
            : [];

        setNecklaces(safeArray);
        setFiltered(safeArray);
      } catch (err) {
        console.error("Fetch error:", err);
        setNecklaces([]);
        setFiltered([]);
      }
    };

    fetchNecklaces();
  }, []);

  /* ---------------- FILTER & SORT ---------------- */
  const filteredProducts = useMemo(() => {
    let temp = [...necklaces];

    if (filters.search) {
      temp = temp.filter((item) =>
        item.name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.category !== "All") {
      temp = temp.filter((item) =>
        item.name.toLowerCase().includes(filters.category.toLowerCase())
      );
    }

    if (filters.minPrice)
      temp = temp.filter((item) => item.price >= Number(filters.minPrice));

    if (filters.maxPrice)
      temp = temp.filter((item) => item.price <= Number(filters.maxPrice));

    if (filters.sort === "low-high") temp.sort((a, b) => a.price - b.price);
    if (filters.sort === "high-low") temp.sort((a, b) => b.price - a.price);

    return temp;
  }, [necklaces, filters]);

  /* ---------------- PAGINATION LOGIC ---------------- */

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const currentNecklaces = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;


  return (
    <div className="max-w-7xl mx-auto mt-16 px-4 ">
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
        totalProducts={filteredProducts.length}
      />

      {/* PRODUCT GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-2  md:grid-cols-3 lg:grid-cols-4 gap-4">
        {currentNecklaces.map((necklace) => (
          <div key={necklace._id} className="bg-[#f5f5f5] rounded-md shadow-md hover:shadow-md border border-gray-300 transition duration-300 overflow-hidden group md:min-h-[400px] relative">
            {(necklace.soldOut || necklace.stockquantity <= 0) && (
              <span className="absolute left-3 top-[120px] md:left-5 md:top-[190px] bg-red-600 text-white text-[10px] md:text-sm px-3 py-1 rounded-full z-20">
                Sold out
              </span>
            )}

            <Link to={`/product/necklace/${necklace._id}`}>
              <div className="p-6 flex justify-center items-center">
                <div className="w-[110px] h-[110px] md:w-[240px] md:h-[240px] rounded-full bg-white flex justify-center items-center shadow-inner overflow-hidden">
                  <img
                    src={
                      necklace.image?.startsWith("http")
                        ? necklace.image
                        : `http://localhost:8080${necklace.image}`
                    }
                    alt={necklace.name}
                    className="w-[70px] h-[70px] md:w-[160px] md:h-[160px] object-contain group-hover:scale-110 transition-all duration-300"
                  />
                </div>
              </div>
            </Link>

            <div className="p-5 text-start">
              <h3 className="font-semibold mb-2 line-clamp-2">
                {necklace.name.split(" ").slice(0, 3).join(" ")}-{necklace.stoneWeight}{necklace.weightUnit}
              </h3>
              <p className="text-sm text-gray-500 mb-2">
                <span className="font-bold text-black">Beadsize - </span>{necklace.beadSize}
              </p>
              <div className="flex gap-2 items-start">
                <span className="text-lg font-bold">
                  Rs.{necklace.price.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Necklaces;

