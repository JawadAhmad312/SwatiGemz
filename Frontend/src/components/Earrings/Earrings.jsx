import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import DesktopFilter from "../filters/DesktopFilter";
import MobileFilter from "../filters/MobileFilter";
import { apiUrl, assetUrl } from "../../lib/api";
import ProductPagination from "../common/ProductPagination";

/* ---------------- SKELETON ---------------- */
const SkeletonCard = () => (
  <div className="animate-pulse bg-white rounded-2xl shadow-md overflow-hidden">
    <div className="h-64 bg-gray-200" />
    <div className="p-5 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
      <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto" />
      <div className="h-10 bg-gray-200 rounded-xl" />
    </div>
  </div>
);

const Earrings = () => {
  const [earrings, setEarrings] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  /* FILTER */
  const [filters, setFilters] = useState({
    search: "",
    category: "All",
    availability: "all",
    sort: "default",
    minPrice: "",
    maxPrice: "",
  });

  /* ✅ PAGINATION */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  
  const categories = [
    "All",
    ...new Set(earrings.map((item) => item.category).filter(Boolean)),
  ];
  
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // optional (nice UX)
    });
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);
  /* ---------------- WISHLIST ---------------- */
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

  /* ---------------- FETCH ---------------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(apiUrl("/api/earrings"));
        const json = await res.json();
 
        const safe = Array.isArray(json)
          ? json
          : Array.isArray(json?.data)
            ? json.data
            : [];

        setEarrings(safe);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ---------------- FILTER LOGIC ---------------- */
  const filteredProducts = useMemo(() => {
    let temp = [...earrings];

    if (filters.search) {
      temp = temp.filter((item) =>
        item.name?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.availability === "inStock") {
      temp = temp.filter((item) => item.stockquantity > 0);
    } else if (filters.availability === "outStock") {
      temp = temp.filter((item) => item.stockquantity <= 0);
    }

    if (filters.category !== "All") {
      temp = temp.filter((item) =>
        (item.category || item.style || "")
          .toLowerCase()
          .includes(filters.category.toLowerCase())
      );
    }

    if (filters.minPrice)
      temp = temp.filter((item) => item.price >= Number(filters.minPrice));

    if (filters.maxPrice)
      temp = temp.filter((item) => item.price <= Number(filters.maxPrice));

    if (filters.sort === "low") temp.sort((a, b) => a.price - b.price);
    if (filters.sort === "high") temp.sort((a, b) => b.price - a.price);
    if (filters.sort === "az") temp.sort((a, b) => a.name.localeCompare(b.name));
    if (filters.sort === "za") temp.sort((a, b) => b.name.localeCompare(a.name));

    return temp;
  }, [earrings, filters]);

  /* ---------------- PAGINATION LOGIC ---------------- */
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const currentProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  /* ---------------- CART ---------------- */
 const addToCart = (product) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    alert("Please login first");
    return;
  }

  const cartKey = `cart_${user._id}`;

  const cart =
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
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          : currentProducts.map((earring) => (
            <div key={earring._id} className="
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
  ">

             

              <Link  to={`/product/earrings/${earring._id}`}>
                <div
                 className="p-6 flex justify-center items-center"
                >
                  {/* SOLD OUT */}

                {(earring.soldOut || earring.stockquantity <= 0) && (
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
                      Sold out
                    </span>
                  )}
                  <div     className="
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
      ">
                    
                    <img
                      src={
                        earring.image?.startsWith("http")
                          ? earring.image
                          : assetUrl(earring.image)
                      }
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

              <div className="p-5 text-start">
                <h3 className="font-semibold mb-2 line-clamp-2">
                  {earring.name}
                </h3>
                <div className="flex  gap-2 items-start">
                  <span className="text-lg font-bold">
                    Rs.{earring.price}
                  </span>
                </div>
               
              </div>
            </div>
          ))}
      </div>

      <ProductPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default Earrings;
