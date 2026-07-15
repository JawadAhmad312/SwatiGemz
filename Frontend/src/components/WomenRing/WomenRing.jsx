import { useEffect, useState, useMemo } from "react";
import { FaHeart } from "react-icons/fa";
import { useNavigate, useLocation, Link } from "react-router-dom";
import MobileFilter from "../filters/MobileFilter";
import DesktopFilter from "../filters/DesktopFilter";

const WomenRing = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
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
    ...new Set(products.map((item) => item.category).filter(Boolean)),
  ];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryFromURL = params.get("category");

    if (categoryFromURL) {
      setFilters((prev) => ({
        ...prev,
        category: categoryFromURL
      }));
    }
  }, [location.search]);
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

  /* 🔥 LISTEN GLOBAL WISHLIST */
  useEffect(() => {
   const handleUpdate = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    setWishlist([]);
    return;
  }

  const wishlistKey = `wishlist_${user._id}`;

  const stored =
    JSON.parse(localStorage.getItem(wishlistKey)) || [];

  setWishlist(stored);
};
    window.addEventListener("wishlistUpdated", handleUpdate);
    return () => window.removeEventListener("wishlistUpdated", handleUpdate);
  }, []);



  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const res = await fetch("http://localhost:8080/api/womenrings");
        const json = await res.json();

        const data = json.data || json; // handle both formats

        setProducts(data);
      } catch (err) {
        setError("Failed to load rings");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
  /* 🔥 FAST WISHLIST LOOKUP */
  const wishlistIds = useMemo(() => {
    return new Set(wishlist.map((item) => item._id));
  }, [wishlist]);

  /* ================= FILTER ================= */
  let filteredProducts = [...products];

  if (filters.availability === "inStock") {
    filteredProducts = filteredProducts.filter((p) => p.stockquantity > 0);
  } else if (filters.availability === "outStock") {
    filteredProducts = filteredProducts.filter((p) => p.stockquantity <= 0);
  }

  if (filters.category !== "All") {
    filteredProducts = filteredProducts.filter(
      (p) => p.category?.toLowerCase() === filters.category.toLowerCase()
    );
  }

  filteredProducts = filteredProducts.filter((p) => {
    return (
      (filters.minPrice === "" || p.price >= Number(filters.minPrice)) &&
      (filters.maxPrice === "" || p.price <= Number(filters.maxPrice))
    );
  });

  if (filters.sort === "low") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (filters.sort === "high") {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (filters.sort === "az") {
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  } else if (filters.sort === "za") {
    filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
  }

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const currentProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  /* ================= CART ================= */
  const addToCart = (product) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    alert("Please login first");
    navigate("/login");
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
 
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold">
        Loading Rings...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
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



        {currentProducts.map((product) => (

          <div
            key={product._id}
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

            {/* IMAGE */}
            
             <Link
  to={`/product/womenrings/${product._id}`}
>
  <div className="p-6 flex justify-center items-center ">

    {/* SOLD OUT */}
    {(product.soldOut || product.stockquantity <= 0) && (
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
    <div  className="
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
                    src={product.image}
                    alt={product.name}
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
          

            <div className="p-4">
              <h3 className="font-semibold mb-2 line-clamp-2">
                {product.name}
              </h3>
              <span className="text-lg font-bold">
                Rs.{product.price.toLocaleString()}
              </span>

            
            </div>

          </div>

        ))}

      </div>
    </div>
  );
};

export default WomenRing;