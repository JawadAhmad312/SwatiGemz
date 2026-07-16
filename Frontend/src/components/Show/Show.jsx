import React, { useState, useEffect } from "react";
import { useLocation, useParams, Link, useNavigate } from "react-router-dom";
import { apiUrl } from "../../lib/api";



function getRandomItems(arr, count) {
  const shuffled = [...arr].sort(() => 0.7 - Math.random());
  return shuffled.slice(0, count);
}
function Show() {
  const { state } = useLocation();
  const { id, type } = useParams();
  const [item, setItem] = useState(state?.item || {});
  const [resolvedType, setResolvedType] = useState(type || state?.item?.type || "");
  const [listings, setListings] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [counter, setCounter] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const navigate = useNavigate();
  const currentType = resolvedType || type || state?.item?.type || "";
  const displayType = currentType;
  const images = [
  item?.image || item?.mainimages,
  ...(item?.images || item?.otherImages || [])
].filter(Boolean);
  /* ---------------- ADD TO CART ---------------- */
  const addToCart = (product, quantity = 1) => {
    if (!product || !product._id) {
      alert("Product not loaded yet");
      return false;
    }

  const user = JSON.parse(localStorage.getItem("user"));

const userId = user?.id || user?._id;

if (!userId) {
  alert("Please login first");
  navigate("/login");
  return false;
}

const cartKey = `cart_${userId}`;

let cart =
  JSON.parse(localStorage.getItem(cartKey)) || [];

const existingIndex = cart.findIndex(
  (item) => item._id === product._id
);

if (existingIndex !== -1) {
  cart[existingIndex] = {
    ...cart[existingIndex],
    quantity:
      cart[existingIndex].quantity + quantity,
  };
} else {
  cart.push({
    ...product,
    quantity,
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
  return true;
  };

  useEffect(() => {
    if (listings.length > 0) {
      setRelatedProducts(getRandomItems(listings, 4));
    }
  }, [listings, id]);
  /* ---------------- BUY NOW ---------------- */
  const buyNow = () => {
    const success = addToCart(item, counter);
    if (success) {
      navigate("/cart");
    }
  };




  useEffect(() => {
    if (state?.item) {
      setItem(state.item);
      setResolvedType(state.item.type || type || "");
      setActiveIndex(0);
    }
  }, [id, state]);
  // ⬇️ NEW: Fetch 4 items for bottom cards
  useEffect(() => {
    const fetchListings = async () => {

      try {

        // GEMSTONE RELATED PRODUCTS
        if (currentType === "gemstone") {

          if (!item?.gemCollection?.slug) return;

          const res = await fetch(
            apiUrl(`/api/gemstones/collection/${item.gemCollection.slug}`)
          );

          const data = await res.json();

          setListings(data.gemstones || []);

          return;
        }

        // OTHER PRODUCTS
        const apiMap = {
          menrings: "menrings",
          stone: "stone",
          womenrings: "womenrings",
          necklace: "necklace",
          earrings: "earrings",
        };

        const res = await fetch(
          apiUrl(`/api/${apiMap[currentType]}`)
        );

        const data = await res.json();

        setListings(data);

      } catch (err) {

        console.log(
          "Error loading listings:",
          err
        );

      }
    };

    fetchListings();

  }, [type, item, resolvedType]);



  useEffect(() => {
    if (state?.item) {
      setItem(state.item);
      setActiveIndex(0);
      return;
    }

    const apiMap = {
      menrings: "menrings",
      stone: "stone",
      womenrings: "womenrings",
      necklace: "necklace",
      earrings: "earrings",
      gemstone: "gemstones",
    };

    const fetchListing = async () => {
      try {
        // GEMSTONE API
    if (currentType === "gemstone") {

          const res = await fetch(
            apiUrl(`/api/gemstones/${id}`)
          );

          const data = await res.json();

          setItem(data.gemstone);

          return;
        }
        const res = await fetch(apiUrl(`/api/${apiMap[currentType]}/${id}`));
        const data = await res.json();
        setItem(data);
        setResolvedType(currentType);
      } catch (err) {
        console.log(err);
      }
    };

    if (currentType) {
      fetchListing();
      return;
    }

    const fetchByIdOnly = async () => {
      const lookupOrder = [
        "stone",
        "menrings",
        "womenrings",
        "necklace",
        "earrings",
        "gemstone",
      ];

      for (const candidateType of lookupOrder) {
        try {
          if (candidateType === "gemstone") {
            const res = await fetch(apiUrl(`/api/gemstones/${id}`));
            if (!res.ok) continue;

            const data = await res.json();
            if (data?.gemstone?._id) {
              setItem(data.gemstone);
              setResolvedType("gemstone");
              return;
            }
            continue;
          }

          const res = await fetch(apiUrl(`/api/${candidateType}/${id}`));
          if (!res.ok) continue;

          const data = await res.json();
          if (data?._id || data?.id) {
            setItem(data);
            setResolvedType(candidateType);
            return;
          }
        } catch (error) {
          continue;
        }
      }
    };

    fetchByIdOnly();
  }, [id, currentType, state?.item, resolvedType, type]);

  //collection show route code 



  return (
    <>
      <div className="max-w-7xl mx-auto min-h-screen mt-12 px-4 
                flex flex-col lg:flex-row justify-center 
                gap-10 lg:gap-20 bg-white">

        {/* LEFT SIDE (Images Section) */}
        <div className="w-full lg:w-[550px] text-center 
                lg:sticky lg:top-10 h-fit">
          <div className="w-full h-[450px] md:h-[520px] flex items-center justify-center 
                          border border-gray-200 shadow-sm mb-6 bg-white">
            <img
             src={images[activeIndex] || item.mainimages}
              alt={item.title}
              className="max-h-[95%] max-w-[50%] object-contain"
            />
          </div>

          <div className="flex justify-center gap-4">
            {images.map((src, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`w-20 h-20 p-1 rounded-md border transition-all 
                  ${activeIndex === idx
                    ? "border-black"
                    : "border-gray-200 hover:border-gray-400"
                  }`}
              >
                <img src={src} className="w-full h-full object-contain" alt="" />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full lg:w-[520px]">
          <p className="text-sm text-gray-500 tracking-wide">SWATI GEMZ</p>
          <h1 className="text-4xl font-mediumbold mt-1 leading-tight abril-fatface-regular">
            {item.name || item.title}
            {displayType === "stone" && ` - ${item.weight} crt`}
            {displayType === "necklace" && ` - ${item.stoneWeight} ${item.weightUnit}`}
          </h1>
          <p className="mt-6 text-sm md:text-[22px] font-semibold">
            Rs.{new Intl.NumberFormat("en-PK").format(
              displayType === "gemstone"
                ? item.price
                : item.price
            )}
            .00 PKR
          </p>

          {/* Quantity */}
          <p className="mt-6 font-medium">Quantity</p>

          <div className="mt-2 border w-40 h-12 mb-4 flex items-center justify-between px-5 rounded">
            <button
              onClick={() => counter > 1 && setCounter(counter - 1)}
              className="text-xl text-gray-600 hover:text-black"
            >
              −
            </button>

            <span className="text-lg font-semibold text-gray-800">{counter}</span>

            <button
              onClick={() => setCounter(counter + 1)}
              className="text-xl text-gray-600 hover:text-black"
            >
              +
            </button>
          </div>
{/* Buttons */}
<div className="space-y-3 mb-6">

  {/* ADD TO CART */}
  <button
    onClick={() =>
      !(item.soldOut || item.stockquantity <= 0) &&
      addToCart(item, counter)
    }
    disabled={
      item.soldOut ||
      item.stockquantity <= 0
    }
    className="w-full border py-3 hover:bg-gray-100 transition disabled:opacity-60 disabled:cursor-not-allowed"
  >
    {item.soldOut ||
    item.stockquantity <= 0
      ? "Sold Out"
      : "Add to cart"}
  </button>

  {/* BUY NOW */}
  <button
    onClick={() =>
      !(item.soldOut || item.stockquantity <= 0) &&
      buyNow()
    }
    disabled={
      item.soldOut ||
      item.stockquantity <= 0
    }
    className="w-full bg-black text-white py-3 hover:bg-gray-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
  >
    {item.soldOut ||
    item.stockquantity <= 0
      ? "Unavailable"
      : "Buy it now"}
  </button>

</div>

          {/* Description */}
          <div className="mt-7 leading-relaxed text-gray-700">
            <h1 className="font-bold text-[18px]">Details:</h1>
            {displayType === "stone" && (
              <p><b>Shape:</b> {item.shape}</p>
            )}

            {displayType === "menrings" && (
              <>
                <div className=" ">
                  <ul className="list-disc pl-10">
                    <li><b>Stone Weight:</b>{item.stoneWeight || item.details?.stoneWeight} carat</li>
                    <li><b>Ring Size:</b>{item.ringSize || item.details?.ringSize}</li>
                    <li><b>Metal:</b> {item.metal || item.details?.metal}</li>
                  </ul>
                </div>
              </>
            )}
            {displayType === "womenrings" && (
              <>
                <div className=" ">
                  <ul className="list-disc pl-10">
                    <li><b>Stone Weight:</b>{item.stoneWeight || item.details?.stoneWeight} carat</li>
                    <li><b>Ring Size:</b> {item.ringSize || item.details?.ringSize}</li>
                    <li><b>Metal:</b> {item.metal || item.details?.metal}</li>
                  </ul>
                </div>
              </>
            )}
            {displayType === "necklace" && (
              <>
                <div className=" ">
                  <ul className="list-disc pl-10">
                    <li><b>Stone Weight:</b> {item.stoneWeight} carat</li>
                    <li><b>Category:</b> {item.category}</li>
                    <li><b>Bead Size:</b> {item.beadSize}</li>
                  </ul>
                </div>
              </>
            )}
            {displayType === "earrings" && (
              <>
                <div className=" ">
                  <ul className="list-disc pl-10">
                    <li><b>Stone Weight:</b> {item.stoneWeight} </li>
                    <li><b>Category:</b> {item.category}</li>
                    <li> {item.availability}</li>
                  </ul>
                </div>
              </>
            )}
            
            {displayType === "gemstone" && (
              <>
                <div>
                  <ul className="list-disc pl-10">
                    <li>
                      <b>Weight:</b> {item.weight} carat
                    </li>

                    <li>
                      <b>Shape:</b> {item.shape}
                    </li>

                    <li>
                      <b>Category:</b> {item.category}
                    </li>

                    <li>
                      <b>Product Code:</b>{" "}
                      {item.productCode}
                    </li>

                    <li>
                      <b>Availability:</b>{" "}
                      {item.soldOut
                        ? "Sold Out"
                        : "In Stock"}
                    </li>
                  </ul>
                </div>
              </>
            )}
            <p className="text-[15px] mt-4 text-gray-700">
              {item.description || "Experience the timeless beauty of this premium, lab-certified gemstone, carefully selected for its exceptional clarity, rich color, and natural brilliance. Each stone offered by SwatiGemz is thoroughly inspected and authenticated to ensure you receive only the finest quality. Known for its elegance and deep symbolic significance, this gemstone is often associated with wisdom, balance, and positive energy. Whether you re purchasing it for astrological benefits or simply for its luxurious appeal, this piece makes a meaningful and long-lasting addition to any collection.At SwatiGemz, we take pride in providing genuine, certified gemstones at the best value in Pakistan. Every stone is sourced responsibly, professionally verified, and crafted to meet the highest standards of excellence—making it a perfect choice for collectors, jewelry lovers, and those seeking spiritual harmony."}
            </p>

            <p className="mt-6">
              <span className="font-bold">Note:</span> The actual product color may vary slightly due to lighting and screen settings.
            </p>
          </div>
        </div>
      </div>

      {/* RELATED PRODUCTS SECTION */}
      <div className="mt-16">
        <h2 className="lg:ml-[125px] mt-6 max-w-7xl mx-auto text-2xl md:text-3xl font-bold abril-fatface-regular inline-block px-3 py-1">
          You Might Love These Gems
        </h2>
        <div
          className="mt-10 max-w-7xl mx-auto px-3 sm:px-4
  grid grid-cols-2 lg:grid-cols-4
  gap-3 sm:gap-6"
        >
          {relatedProducts.map((product) => (
            <Link
              to={
                displayType === "gemstone"
                  ? `/product/gemstone/${product.slug}`
                  : `/product/${type}/${product._id}`
              }
              state={{ item: product }}
              key={product._id}
              className="group bg-white rounded-lg sm:rounded-2xl
      shadow-sm border border-gray-200
      hover:shadow-xl hover:-translate-y-1
      transition-all duration-300 overflow-hidden"
            >

              {/* Image */}
              {/* Image */}
<div
  className="relative w-full h-[170px] sm:h-[280px]
  bg-gray-50 flex items-center justify-center
  p-3 sm:p-4"
>

  {/* SOLD OUT */}
  {(product.soldOut || product.stockquantity <= 0) && (
    <span
      className="
        absolute
        left-3
        bottom-3
        sm:left-5
        sm:bottom-5
        bg-red-600
        text-white
        text-xs
        sm:text-sm
        px-3
        sm:px-5
        py-1.5
        sm:py-2
        rounded-full
        z-20
        shadow-lg
      "
    >
      Sold out
    </span>
  )}
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-[90px] sm:h-[150px]
          w-auto object-contain transition-transform
          duration-300 group-hover:scale-105"
                />
              </div>

              {/* Content */}
              <div className="p-3 sm:p-5 text-start">

                <h3
                  className="text-[14px] sm:text-lg
          font-semibold text-gray-900
          group-hover:text-black
          leading-[20px] sm:leading-normal
          line-clamp-2 min-h-[42px]"
                >
                  {product.name}
                </h3>

                <p className="mt-2 text-gray-600 text-[13px] sm:text-[15px]">
                  Rs.
                  {new Intl.NumberFormat("en-PK").format(
                    displayType === "gemstone"
                      ? product.price
                      : product.price
                  )}
                  PKR
                </p>

              </div>
            </Link>
          ))}
        </div>
      </div>

    </>
  );
}

export default Show;
