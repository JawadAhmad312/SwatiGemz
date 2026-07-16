import React, { useEffect, useState } from 'react';
import { Link, NavLink , useNavigate} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "/src/context/AuthContext";
import { apiUrl } from "../../lib/api";
import './Navbar.css'
import { MdOutlineQrCodeScanner } from "react-icons/md";
import AnnouncementBar from './Announcements';
import { useLocation } from "react-router-dom";




function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const { user, logout, loading } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
const location = useLocation();
  const filteredResults = results.filter((item) =>
    item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleLogout = async () => {
  await logout();

  navigate("/", { replace: true });
};
  useEffect(() => {
  setShowSearch(false);
  setIsOpen(false);
}, [location.pathname]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm]);

useEffect(() => {
  const updateCartCount = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      setCartCount(0);
      return;
    }

    const userId = user?.id || user?._id;

const cartKey = `cart_${userId}`;

    const cart =
      JSON.parse(localStorage.getItem(cartKey)) || [];

    const count = cart.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    setCartCount(count);
  };

  updateCartCount();

  window.addEventListener(
    "cartUpdated",
    updateCartCount
  );

  return () => {
    window.removeEventListener(
      "cartUpdated",
      updateCartCount
    );
  };
}, [user]);
  useEffect(() => {
    if (!debouncedSearch) {
      setResults([]);
      return;
    }

    const fetchSearch = async () => {
      try {
        const res = await fetch(
          apiUrl(`/api/search?q=${debouncedSearch}`)
        );
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchSearch();
  }, [debouncedSearch]);
  const highlightText = (text) => {
    if (!searchTerm) return text;

    const regex = new RegExp(`(${searchTerm})`, "gi");

    return text?.split(regex).map((part, i) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <span key={i} className="bg-yellow-200 px-1 rounded">
          {part}
        </span>
      ) : (
        part
      )
    );
  };
  return (
    <>
<AnnouncementBar/>
      {/* FIRST NAVBAR (normal) */}
     <div className="bg-white w-full border-b-2 border-gray-200 md:border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.06)] md:px-10 md:py-4">

        <div className="navbar flex items-center  justify-between px-4">

          {/* LEFT SIDE - Social Icons */}
          <div className="hidden md:flex gap-5 text-gray-500 text-lg">
            {[
              { icon: "facebook-f", brand: "facebook", link: "https://www.facebook.com/share/1CB9d81kpT/?mibextid=wwXIfr" },
              { icon: "tiktok", brand: "tiktok", link: "https://www.tiktok.com/@swatigemz?_r=1&_t=ZS-95Q3vAEp15I" },
              { icon: "instagram", brand: "instagram", link: "https://www.instagram.com/swati_gems461?igsh=MWZjNTBiajV2YnM3NA%3D%3D&utm_source=qr" },
              { icon: "youtube", brand: "youtube", link: "https://youtube.com/@swatigems9586?si=BQampnMwrp_xLKiK" }
            ].map((item) => (
              <a
                key={item.icon}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i
                  key={item.icon}
                  className={`fa-brands fa-${item.icon} social-icon ${item.brand}`}
                ></i>
              </a>
            ))}
          </div>
          <button
            className="md:hidden text-3xl text-gray-700 leading-none"
            onClick={() => setIsOpen(true)}
          >
            ☰
          </button>
          {/* CENTER - Logo */}
          <div className="flex flex-col items-center select-none">
            <img
              src="/images/logo.png"
              alt="Swati Gemz"
              className="w-12 md:w-16 object-contain"
            />

            <Link to="/">
              <h2 className="text-sm md:text-[26px] font-bold bg-gradient-to-r from-[#092805] to-[#224225] bg-clip-text text-transparent tracking-wide">
                SWATI GEMZ
              </h2>
            </Link>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-6 text-lg">

            {/* Search */}
            <i
              onClick={() => setShowSearch(!showSearch)}
              className="fa-solid fa-magnifying-glass cursor-pointer hover:text-[#386855] transition"
            ></i>

           {/* User Section */}
<div className="hidden md:flex items-center  z-[999]">
  {user ? (

    <div
      className="
        relative
        group
      "
    >

      {/* Profile Avatar */}

      <div

        className="
          w-9
          h-9
          rounded-full
          bg-[#224225]
          text-white
          flex
          items-center
          justify-center
          text-sm
          font-semibold
          cursor-pointer
          overflow-hidden
          border
          border-[#224225]
        "

      >

        {user?.picture ? (

          <img

            src={user.picture}

            alt="Profile"

            className="
              w-full
              h-full
              object-cover
            "

          />

        ) : (

          user?.email
            ?.substring(0, 2)
            ?.toUpperCase()

        )}

      </div>

      {/* Invisible Hover Area */}

      <div
        className="
          absolute
          top-full
          right-0
          w-full
          h-3
        "
      />

      {/* Dropdown */}

      <div

        className="
          absolute
          right-0
          top-full
          mt-2
          w-44
          bg-white
          rounded
          shadow-xl
          border
          border-gray-100

          opacity-0
          invisible

          group-hover:opacity-100
          group-hover:visible

          transition-all
          duration-200

          z-50
        "

      >

        <Link

          to="/my-orders"

          className="
            block
            px-4
            py-3
            text-sm
            text-gray-700
            hover:bg-gray-50
            rounded-t-xl
          "

        >

          My Orders

        </Link>

        {user?.role?.trim()?.toLowerCase() === "admin" && user?.status === "Active" && (
          <Link
            to="/admin/dashboard"
             target="_blank"
            className="
              block
              px-4
              py-3
              text-sm
              text-green-700
              hover:bg-green-50
              border-t
              border-gray-100
              font-semibold
            "
          >
            <i className="fa-solid fa-shield-halved mr-2"></i>
            Admin Dashboard
          </Link>
        )}

        <button

           onClick={handleLogout}

          className="
            w-full
            text-left
            px-4
            py-3
            text-sm
            text-red-600
            hover:bg-red-50
            rounded-b-xl
          "

        >

          Logout

        </button>

      </div>

    </div>

  ) : (

    <NavLink

      to="/login"

      className="
        hover:text-[#386855]
        transition
      "

    >

      <i className="fa-solid fa-user text-xl"></i>

    </NavLink>

  )}

</div>
            {/* Cart */}
            <NavLink
              to="/cart"
              className="relative hover:text-[#386855] transition"
            >
              <i className="fa-solid fa-cart-shopping"></i>

              {user && cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-[#092805] to-[#224225] text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </NavLink>
         {user?.role?.trim()?.toLowerCase() === "admin" && user?.status === "Active" && (
 <div className="relative group  lg:flex">
   <Link
    to="/admin/dashboard"
    title="Admin Dashboard"
     target="_blank"
    className="
      w-11
      h-11
      rounded-full
      border-2
      border-green-600
      flex
      items-center
      justify-center
      hover:bg-green-50
      transition-all
      duration-200
      text-green-700
      font-bold
    "
  >
    <i className="fa-solid fa-shield-halved text-lg"></i>
  </Link>
  <div className="absolute right-0 top-full mt-2 bg-gray-800 text-white text-xs px-3 py-2 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
    Admin Dashboard
  </div>
 </div>
)}
           
          </div>

        </div>
        {showSearch && (
          <div className="search-overlay">
            <div className="search-panel">
              <div className="search-panel__header">
                <div>
                  <p className="search-panel__eyebrow">Find products faster</p>
                  <h3 className="search-panel__title">Search the collection</h3>
                </div>
                <button
                  onClick={() => setShowSearch(false)}
                  className="search-panel__close"
                  aria-label="Close search"
                >
                  <i className="fa-solid fa-xmark" />
                </button>
              </div>

              <div className="search-input-shell">
                <i className="fa-solid fa-magnifying-glass search-input-icon" />
                <input
                  type="text"
                  placeholder="Search products, stones, rings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>

              {searchTerm && (
                <div className="search-results search-scroll">
                  {filteredResults.length === 0 ? (
                    <div className="search-empty">
                      <p className="text-base font-medium text-slate-700">
                        No products found
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Try a different keyword or browse a broader category.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <div className="search-section">
                        <div className="search-section__head">
                          <h4>Suggestions</h4>
                          <span>{filteredResults.slice(0, 5).length}</span>
                        </div>

                        <div className="space-y-2">
                          {filteredResults.slice(0, 5).map((item) => (
                            <div key={item._id} className="search-suggestion">
                              <div className="min-w-0">
                                <p className="search-suggestion__title">
                                  {highlightText(item.title || item.name)}
                                </p>
                                <span className="search-chip">
                                  {item.type}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="search-section md:border-l md:border-slate-200 md:pl-5">
                        <div className="search-section__head">
                          <h4>Products</h4>
                          <span>Top matches</span>
                        </div>

                        <div className="space-y-3">
                          {filteredResults.slice(0, 5).map((item) => (
                            <Link
                              key={item._id}
                              to={`/product/${item.type}/${item._id}`} 
                              state={{ item }}
                              onClick={() => setShowSearch(false)}
                              className="search-product"
                            >
                              <img
                                src={item.image}
                                alt={item.title || item.name}
                                className="search-product__image"
                              />

                              <div className="min-w-0 flex-1">
                                <p className="search-product__title">
                                  {item.title || item.name}
                                </p>
                                <p className="search-product__price">
                                  PKR {item.price}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>


      {/* SECOND NAVBAR (STICKY ON SCROLL) */}
      <div className="md:navbar md:h-4 second-navbar md:sticky md:top-0 md:z-50 md:bg-white md:shadow-sm">
        <nav className="px-4  md:navbar md:navbar-center">
          <div className="flex justify-between items-center mx-auto max-w-screen-xl w-full">

            {/* ---------------- Mobile Hamburger Icon ---------------- */}

            {/* ---------------- Desktop Menu ---------------- */}
            <ul className="hidden md:flex flex-row justify-center roboto-mono mx-auto items-center font-medium space-x-15">
              <li>
                <NavLink to="/Stone" className={({ isActive }) =>
                  `px-3 py-2 md:text-[14px] lg:text-lg md:text-[15px] transition 
                                ${isActive ? "text-gray-600" : "text-black"}`
                }>
                  Stones
                </NavLink>
              </li>



              <li className="relative group">
                <div className="flex items-center md:text-[14px] lg:text-lg gap-1 cursor-pointer">
                  Rings
                  <svg
                    className="w-4 h-4 text-gray-600 transition"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <ul className="absolute left-2 w-48 bg-white shadow-lg rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition duration-200">
                  <li><NavLink to="/collections/menrings" className="block px-5 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-black transition">MenRings</NavLink></li>
                  <li><NavLink to="/collections/womenrings" className="block px-5 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-black transition">WomenRings</NavLink></li>
                </ul>
              </li>


              {/* Dropdown 1 */}
              <li className="relative group">
                <div className="flex items-center md:text-[14px] lg:text-lg gap-1 cursor-pointer">
                  Jewellery
                  <svg
                    className="w-4 h-4 text-gray-600 transition"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                <ul className="absolute left-2 w-48 bg-white shadow-lg rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition duration-200">
                  <li><NavLink to="/collections/necklaces" className="block px-5 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-black transition">Necklaces</NavLink></li>
                  <li><NavLink to="/collections/earrings" className="block px-5 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-black transition">Earrings</NavLink></li>
                </ul>
              </li>

              <li>
                <NavLink to="/Services" className={({ isActive }) =>
                  `px-3 py-2 md:text-[14px] lg:text-lg transition 
                                ${isActive ? "text-gray-600" : "text-black"}`
                }>
                  Services
                </NavLink>
              </li>

              {/* About Dropdown */}
              <li className="relative group">
                <div className="flex items-center gap-1">
                  <NavLink
                    to="/AboutUs"
                    className={({ isActive }) =>
                      ` md:text-[14px] lg:text-lg transition 
                                        ${isActive ? "text-gray-600" : "text-black"}`
                    }
                  >
                    About Us
                  </NavLink>
                </div>
              </li>

              <li>
                <NavLink to="/ContactUs" className={({ isActive }) =>
                  `px-3 py-2 md:text-[14px] lg:text-lg transition 
                                ${isActive ? "text-gray-600" : "text-black"}`
                }>
                  Contact Us
                </NavLink>
              </li>

              <li>
                <NavLink to="/Faqs" className={({ isActive }) =>
                  `px-3 py-2 md:text-[14px] lg:text-lg transition 
                                ${isActive ? "text-gray-600" : "text-black"}`
                }>
                  FAQ's
                </NavLink>
              </li>

            </ul>

          </div>
        </nav>

        {/* ---------------- Mobile Sidebar ---------------- */}
        <div className={`fixed top-0 left-0 h-full w-72 bg-white shadow-lg z-50 transform 
                ${isOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300`}>

          {/* Close Button */}
          <button
            className="text-2xl absolute right-4 top-4"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>

          {/* Mobile Menu Items */}
          <ul className="flex flex-col mt-16 space-y-4 px-6">

            <NavLink to="/stone" onClick={() => setIsOpen(false)} className="text-lg text-gray-700">Stones</NavLink>
            <details className="text-gray-700 group">
              <summary className="cursor-pointer text-lg flex items-center justify-between pr-2">
                Rings
                {/* Arrow Icon */}
                <svg
                  className="w-4 h-4 text-gray-600 transition-transform duration-200 group-open:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>

              <ul className="pl-4 mt-2 space-y-2">
                <li><NavLink to="/collections/menrings" onClick={() => setIsOpen(false)}>MenRings</NavLink></li>
                <li><NavLink to="/collections/womenrings" onClick={() => setIsOpen(false)}>WomenRings</NavLink></li>

              </ul>
            </details>
            {/* Mobile Dropdown Example */}
            <details className="text-gray-700 group">
              <summary className="cursor-pointer text-lg flex items-center justify-between pr-2">
                Jewellery

                {/* Arrow Icon */}
                <svg
                  className="w-4 h-4 text-gray-600 transition-transform duration-200 group-open:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>

              <ul className="pl-4 mt-2 space-y-2">
                <li><NavLink to="/collections/necklaces" onClick={() => setIsOpen(false)}>Necklaces</NavLink></li>
                <li><NavLink to="/collections/earrings" onClick={() => setIsOpen(false)}>Earrings</NavLink></li>
              </ul>
            </details>



            <NavLink to="/Services" onClick={() => setIsOpen(false)} className="text-lg text-gray-700">Services</NavLink>
            <NavLink to="/AboutUs" onClick={() => setIsOpen(false)} className="text-lg text-gray-700">About</NavLink>
            <NavLink to="/ContactUs" onClick={() => setIsOpen(false)} className="text-lg text-gray-700">Contact Us</NavLink>
            <NavLink to="/Faqs" onClick={() => setIsOpen(false)} className="text-lg text-gray-700">FAQ's</NavLink>
            <div className="text-lg text-green-700 ">
    Admin Dashboard
  </div>
          </ul>

          <div className="absolute bottom-8 left-6 w-[calc(100%-3rem)] flex flex-col items-start">

            {user ? (
              <div className="w-full space-y-4 text-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#224225] text-white flex items-center justify-center text-sm font-semibold overflow-hidden">
                    {user?.picture ? (
                      <img
                        src={user.picture}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      user?.email?.substring(0, 2)?.toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">
                      {user?.name || user?.email}
                    </p>
                    <p className="text-xs text-gray-500">
                      Signed in
                    </p>
                  </div>
                </div>

                <NavLink
                  to="/my-orders"
                  onClick={() => setIsOpen(false)}
                  className="hover:text-[#386855] transition flex items-center gap-2"
                >
                  <i className="fa-solid fa-bag-shopping"></i>
                  <span className="text-sm">My Orders</span>
                </NavLink>

                <button
                  onClick={async () => {
                    await handleLogout();
                    setIsOpen(false);
                  }}
                  className="hover:text-[#386855] transition flex items-center gap-2"
                >
                  <i className="fa-solid fa-right-from-bracket"></i>
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 mb-5 text-gray-700">
                <NavLink
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="hover:text-[#386855] transition flex items-center gap-2"
                >
                  <i className="fa-solid fa-user"></i>
                  <span className="text-sm">Log in</span>
                </NavLink>
              </div>
            )}
            
            {/* Currency */}
            <div className="flex items-center gap-2 text-sm text-gray-700 mb-6">
              <span>Pakistan | PKR Rs</span>

              <i className="fa-solid fa-angle-down text-xs"></i>
            </div>

            {/* Social Icons */}
            <ul className="flex items-center gap-4 text-gray-500">

              <li className="social-icon facebook">
                <Link
                  to="https://www.facebook.com/share/1CB9d81kpT/?mibextid=wwXIfr"
                  target="_blank"
                >
                  <i className="fa-brands fa-facebook-f"></i>
                </Link>
              </li>

              <Link
                to="https://www.tiktok.com/@swatigemz?_r=1&_t=ZS-95Q3vAEp15I"
                target="_blank"
              >
                <li className="social-icon tiktok">
                  <i className="fa-brands fa-tiktok"></i>
                </li>
              </Link>

              <Link
                to="https://www.instagram.com/swati_gems461?igsh=MWZjNTBiajV2YnM3NA%3D%3D&utm_source=qr"
                target="_blank"
              >
                <li className="social-icon instagram">
                  <i className="fa-brands fa-instagram"></i>
                </li>
              </Link>

              <Link
                to="https://youtube.com/@swatigems9586?si=BQampnMwrp_xLKiK"
                target="_blank"
              >
                <li className="social-icon youtube">
                  <i className="fa-brands fa-youtube"></i>
                </li>
              </Link>

            </ul>
          </div>

        </div>

        {/* Background Overlay */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setIsOpen(false)}
          ></div>
        )}
      </div>


    </>
  );
}

export default Navbar;
