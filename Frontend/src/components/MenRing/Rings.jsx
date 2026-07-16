import { useEffect, useState, useMemo } from "react";
import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import DesktopFilter from "../filters/DesktopFilter";
import MobileFilter from "../filters/MobileFilter";
import { assetUrl } from "../../lib/api";


const Rings = () => {
  const [rings, setRings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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
    ...new Set(rings.map((item) => item.category).filter(Boolean)),
  ];

  /* ================= LOAD WISHLIST ================= */


  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const fetchRings = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/menrings");
        const json = await res.json();


        const data = Array.isArray(json)
          ? json
          : Array.isArray(json.data)
            ? json.data
            : [];

        setRings(data);
      } catch (err) {
        setError("Failed to load rings");
      } finally {
        setLoading(false);
      }
    };

    fetchRings();


  }, []);

  /* ================= FILTER ================= */
  const filteredProducts = useMemo(() => {
    let temp = [...rings];


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
    if (filters.sort === "newest")
      temp.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return temp;


  }, [rings, filters]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const currentRings = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  /* ================= CART ================= */
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
    cart[existingIndex].quantity += 1;
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

  /* ================= WISHLIST ================= */


  if (loading) {
    return (<div className="min-h-screen flex items-center justify-center text-xl font-semibold">
      Loading Rings... </div>
    );
  }

  if (error) {
    return (<div className="min-h-screen flex items-center justify-center text-red-500">
      {error} </div>
    );
  }

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
        {currentRings.map((ring) => (
          <div key={ring._id} className="bg-[#f5f5f5] rounded-md shadow-md hover:shadow-md border border-gray-300 transition duration-300 overflow-hidden group md:min-h-[400px] relative">

        

          <Link to={`/product/menrings/${ring._id}`}>

            <div className="p-6 flex justify-center items-center">

              {(ring.soldOut || ring.stockquantity <= 0) && (
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
                      src={
                        ring.image?.startsWith("http")
                          ? ring.image
                          : assetUrl(ring.image)
                      }
                  alt={ring.name}
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
              <h3 className="font-semibold mb-2">
                {ring.name}
              </h3>
              <p className="text-lg font-semibold mb-3">
                PKR.{Number(ring.price).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rings;
