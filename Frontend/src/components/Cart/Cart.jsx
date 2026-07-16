import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiUrl, assetUrl } from "../../lib/api";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  /* ---------------- LOAD CART ---------------- */
  useEffect(() => {
   const loadCart = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  // Login nahi hai
  if (!user) {
    setCart([]);
    return;
  }

  const cartKey = `cart_${user.id || user._id}`;

  const saved =
    JSON.parse(localStorage.getItem(cartKey)) || [];

  setCart(saved);
};

    loadCart();

    // ✅ listen for updates
    window.addEventListener("cartUpdated", loadCart);

    // 🔥 EXTRA: ensure sync even if event missed
    const interval = setInterval(loadCart, 500);

    return () => {
      window.removeEventListener("cartUpdated", loadCart);
      clearInterval(interval);
    };
  }, []);

  /* ---------------- UPDATE QTY ---------------- */
  const updateQty = (id, type) => {
    const updated = cart.map((item) => {
      if (item._id === id) {
        const qty =
          type === "inc" ? item.quantity + 1 : item.quantity - 1;
        return { ...item, quantity: Math.max(1, qty) };
      }
      return item;
    });

  const user = JSON.parse(localStorage.getItem("user"));

if (!user || (!user.id && !user._id)) return;

const cartKey = `cart_${user.id || user._id}`;

localStorage.setItem(
  cartKey,
  JSON.stringify(updated)
);
    setCart(updated); // ✅ immediate UI update

    window.dispatchEvent(new Event("cartUpdated"));
  };

  /* ---------------- REMOVE ---------------- */
  const removeItem = (id) => {
    const updated = cart.filter((item) => item._id !== id);

  const user = JSON.parse(localStorage.getItem("user"));

if (!user || (!user.id && !user._id)) return;

const cartKey = `cart_${user.id || user._id}`;

localStorage.setItem(
  cartKey,
  JSON.stringify(updated)
);
    setCart(updated); // ✅ update UI first

    window.dispatchEvent(new Event("cartUpdated"));
  };

  /* ---------------- PRICE CALC ---------------- */
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  /* ---------------- CHECKOUT ---------------- */
  const handleCheckout = async () => {
    try {
      const res = await fetch(
        apiUrl("/api/check-auth"),
        {
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!data.loggedIn) {
        alert("Please login before placing an order");
        navigate("/login");
        return;
      }

      navigate("/checkout", {

  state: {

    cart,

    subtotal,

    total: subtotal,
  },
});
    } catch (err) {
      console.log(err);
    }
  };

  /* ---------------- EMPTY CART ---------------- */
  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-gray-500 mb-4">Your cart is empty 🛒</p>
        <Link to="/" className="underline">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="flex md:flex-col sm:flex-row sm:items-center justify-between sm:justify-between gap-4 mb-8  sm:px-6">
        <h1 className="text-2xl md:text-4xl font-bold text-center sm:text-left">
          Your Cart ({cart.length} items)
        </h1>
        <Link
          to="/"
          className="underline text-sm md:text-lg text-center sm:text-right hover:text-[#224225] transition"
        >
          Continue shopping
        </Link>

      </div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl shadow-md p-4 sm:p-6 flex gap-1 sm:gap-6 w-full overflow-hidden"
            >
                <img
                  src={
                    item.image?.startsWith("http")
                      ? item.image
                    : assetUrl(item.image)
                }
                className="w-20 h-20 sm:w-28 sm:h-28 object-cover rounded-xl flex-shrink-0"
              />

              <div className="flex-1">
                <h3 className="font-semibold text-sm sm:text-lg mb-1 line-clamp-1">
                  {item.name}
                </h3>

                <p className="text-gray-500 mb-4">
                Rs.{Number(item.price || 0).toLocaleString()}
                </p>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQty(item._id, "dec")}
                    className="w-8 h-8 border rounded"
                  >
                    −
                  </button>

                  <span className="font-medium">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => updateQty(item._id, "inc")}
                    className="w-8 h-8 border rounded"
                  >
                    +
                  </button>

                  <button
                    onClick={() => removeItem(item._id)}
                    className="ml-6 text-sm text-red-500"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="font-semibold text-sm sm:text-base whitespace-nowrap">
                Rs.{
  Number(
    (item.price || 0) *
    item.quantity
  ).toLocaleString()
}
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT */}
        <div className="bg-white rounded-2xl shadow-lg p-6 h-fit">
          <h2 className="text-xl font-semibold mb-6">
            Order Summary
          </h2>

          <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span>Estimated total</span>
              <span>Rs.{subtotal.toLocaleString()}.00 PKR</span>
            </div>  
          </div>

          <button
            onClick={handleCheckout}
            className="mt-8 w-full bg-gradient-to-r from-[#092805] to-[#224225] text-white py-3 rounded-xl"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </section>
  );
};

export default Cart;
