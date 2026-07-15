import { useLocation, useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import api from "../../lib/api";

const Checkout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { cart, subtotal, total } = state;
  const shipping = 350;

  const [loading, setLoading] = useState(false);


  const [paymentMethod, setPaymentMethod] = useState("COD");

  const [paymentProof, setPaymentProof] = useState(null);

  const [address, setAddress] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    phone: ""
  });

  const [errors, setErrors] = useState({});
useEffect(() => {
  api.get("/current-user")
  .then(res => {

    setAddress(prev => ({

      ...prev,

      email:
        res.data.user.email

    }));

  })
  .catch(() => {});

}, []);
  /* ---------------- VALIDATION ---------------- */
  const validate = () => {
    let err = {};
if (!address.firstName)
  err.firstName = "First name is required";

if (!address.lastName)
  err.lastName = "Last name is required";

if (!address.email)
  err.email = "Email is required";

if (
  address.email &&
  !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email)
)
  err.email = "Enter a valid email";

if (!address.phone)
  err.phone = "Phone number is required";

if (
  address.phone &&
  address.phone.length < 11
)
  err.phone = "Enter a valid phone number";

if (!address.address)
  err.address = "Address is required";

if (!address.city)
  err.city = "City is required";
    if (
      paymentMethod === "Bank" &&
      !paymentProof
    ) {
      err.paymentProof = true;
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  /* ---------------- OTP ---------------- */


  /* ---------------- ORDER ---------------- */
  const placeOrder = async () => {

   if (!validate()) {
  return;
}

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("items", JSON.stringify(cart));
      formData.append("subtotal", subtotal);
      formData.append("shipping", shipping);
      formData.append("total", total + shipping);
      formData.append("shippingAddress", JSON.stringify(address));
      formData.append("paymentMethod", paymentMethod);
      formData.append("status", "pending");

      if (paymentProof) {
        formData.append("paymentProof", paymentProof);
      }
      console.log(cart);
      console.log("Address Data:");
  console.log(address);
      const response =
        await api.post(
          "/api/orders/create-order",
          {
            items: cart,
            subtotal,
            tax: 0,
            shipping,
            total: total + shipping,
            shippingAddress: address,
            paymentMethod
          },
        );

    const user = JSON.parse(
  localStorage.getItem("user")
);

if (user) {
  const cartKey =
    `cart_${user.id || user._id}`;

  localStorage.removeItem(cartKey);

  window.dispatchEvent(
    new Event("cartUpdated")
  );
}

      navigate(
        "/order-success",
        {
          state: {
            order: response.data.order
          }
        }
      );

    } catch (err) {

      console.log(err);

      alert(
        err?.response?.data?.error ||
        err.message ||
        "Order failed"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2">

        {/* LEFT SIDE */}

        <div className="px-6 lg:px-14 py-10">

          {/* CONTACT */}

          <div className="mb-8">

            <div className="flex justify-between items-center mb-3">

              <h2 className="text-[22px] font-semibold">
                Contact
              </h2>

              <button className="text-blue-600 text-sm">
                Sign in
              </button>

            </div>

            <input
              name="email"
              placeholder="Email or mobile phone number"
  value={address.email}
  readOnly
              className={`

              w-full
              border
              rounded
              px-4
              py-3
              text-sm
              outline-none
              focus:border-blue-500

              ${errors.email
                  ? "border-red-500"
                  : "border-gray-300"}
            `}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                Please enter a valid email
              </p>
            )}
            <label className="flex items-center gap-2 mt-3 text-sm">

              <input type="checkbox" />

              Email me with news and offers

            </label>

          </div>

          {/* DELIVERY */}

          <div>

            <h2 className="text-[22px] font-semibold mb-4">
              Delivery
            </h2>

            <select
              className="w-full border border-gray-300 rounded px-4 py-3 text-sm mb-4"
            >
              <option>Pakistan</option>
            </select>

            <div className="grid grid-cols-2 gap-4 mb-4">

              <input
                name="firstName"
                placeholder="First name"
                onChange={handleChange}
                className={`

                border
                rounded
                px-4
                py-3
                text-sm

                ${errors.firstName
                    ? "border-red-500"
                    : "border-gray-300"}
              `}
              />

              <input
                name="lastName"
                placeholder="Last name"
                onChange={handleChange}
                className={`

                border
                rounded
                px-4
                py-3
                text-sm

                ${errors.lastName
                    ? "border-red-500"
                    : "border-gray-300"}
              `}
              />

            </div>

            <input
              name="address"
              placeholder="Address"
              onChange={handleChange}
              className={`

              w-full
              border
              rounded
              px-4
              py-3
              text-sm
              mb-2

              ${errors.address
                  ? "border-red-500"
                  : "border-gray-300"}
            `}
            />
{errors.address && (
  <p className="text-red-500 text-sm">
    Please enter a valid Address number
  </p>
)}
            <input
              placeholder="Apartment, suite, etc. (optional)"
              className="w-full border border-gray-300 rounded px-4 py-3 text-sm mb-4"
            />

            <div className="grid grid-cols-2 gap-4 mb-4">

              <input
                name="city"
                placeholder="City"
                onChange={handleChange}
                className={`

                border
                rounded
                px-4
                py-3
                text-sm

                ${errors.city
                    ? "border-red-500"
                    : "border-gray-300"}
              `}
              />

              <input
                placeholder="Postal code (optional)"
                className="border border-gray-300 rounded px-4 py-3 text-sm"
              />

            </div>

            <input
              name="phone"
              placeholder="Phone"
              onChange={handleChange}
              className={`

              w-full
              border
              rounded
              px-4
              py-3
              text-sm
              mb-2

              ${errors.phone
                  ? "border-red-500"
                  : "border-gray-300"}
            `}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm ">
                Please enter a valid phone number
              </p>
            )}

            <label className="flex items-center gap-2 text-sm mb-2">

              <input type="checkbox" />

              Save this information for next time

            </label>

            <label className="flex items-center gap-2 text-sm">

              <input type="checkbox" />

              Text me with news and offers

            </label>

          </div>

          {/* SHIPPING */}

          <div className="mt-8">

            <h2 className="text-[22px] font-semibold mb-3">
              Shipping method
            </h2>

            <div className="border border-blue-600 rounded px-4 py-4 flex justify-between bg-blue-50">

              <span>Delivery Charges</span>

              <span>Rs 350.00</span>

            </div>

          </div>

          {/* PAYMENT */}

          <div className="mt-8">

            <h2 className="text-[22px] font-semibold">
              Payment
            </h2>

            <p className="text-sm text-gray-500 mt-1 mb-4">
              All transactions are secure and encrypted.
            </p>

            <label className={`

            border
            rounded-t
            p-4
            flex
            items-center
            gap-3

            ${paymentMethod === "COD"
                ? "border-blue-600 bg-blue-50"
                : "border-gray-300"}
          `}>

              <input
                type="radio"
                checked={paymentMethod === "COD"}
                onChange={() =>
                  setPaymentMethod("COD")
                }
              />

              Cash on Delivery (COD)

            </label>

            <label className={`

            border
            border-t-0
            rounded-b
            p-4
            flex
            items-center
            gap-3

            ${paymentMethod === "Bank"
                ? "border-blue-600 bg-blue-50"
                : "border-gray-300"}
          `}>

              <input
                type="radio"
                checked={paymentMethod === "Bank"}
                onChange={() =>
                  setPaymentMethod("Bank")
                }
              />

              Bank Deposit

            </label>

            {paymentMethod === "Bank" && (

              <div className="mt-4">

                <input
                  type="file"
                  onChange={(e) =>
                    setPaymentProof(
                      e.target.files[0]
                    )
                  }
                  className="w-full border border-gray-300 rounded p-3"
                />
                {errors.paymentProof && (
                  <p className="text-red-500 text-sm mt-2">
                    Payment proof is required
                  </p>
                )}
              </div>
            )}

          </div>

          {/* COMPLETE ORDER */}

          <button
            onClick={placeOrder}
            disabled={loading}
            className="
    w-full
    bg-blue-600
    hover:bg-blue-700
    text-white
    py-4
    rounded
    font-medium
    mt-10
    transition
    disabled:bg-gray-400
    disabled:cursor-not-allowed
  "
          >

            {loading
              ? "Processing..."
              : "Complete order"}

          </button>

        </div>

        {/* RIGHT SIDE */}

        <div className="bg-[#f5f5f5] px-8 py-10 border-l">

          {cart.map((item) => (

            <div
              key={item._id}
              className="flex justify-between items-center mb-6"
            >

              <div className="flex gap-4 items-center">

                <div className="relative">

                  <img
                    src={
                      item.mainimages ||
                      item.image
                    }
                    className="

                    w-16
                    h-16
                    rounded
                    border
                    object-cover
                  "
                  />

                  <span className="

                  absolute
                  -top-2
                  -right-2
                  bg-gray-700
                  text-white
                  text-xs
                  w-5
                  h-5
                  flex
                  items-center
                  justify-center
                  rounded-full
                ">

                    {item.quantity}

                  </span>

                </div>

                <div>

                  <p className="text-sm font-medium">
                    {item.title || item.name}
                  </p>

                </div>

              </div>

              <span className="text-sm">

                Rs.
                {item.price * item.quantity}

              </span>

            </div>
          ))}

          {/* DISCOUNT */}

          <div className="flex gap-3 mb-6">

            <input
              placeholder="Discount code"
              className="

              flex-1
              border
              border-gray-300
              rounded
              px-4
              py-3
              text-sm
            "
            />

            <button className="

            bg-gray-200
            px-5
            rounded
            text-sm
          ">

              Apply

            </button>

          </div>

          {/* TOTALS */}

          <div className="space-y-3 text-sm">

            <div className="flex justify-between">

              <span>Subtotal</span>

              <span>Rs {subtotal}</span>

            </div>

            <div className="flex justify-between">

              <span>Shipping</span>

              <span>Rs {shipping}</span>

            </div>

            <div className="

            flex
            justify-between
            items-center
            pt-4
            border-t
            mt-4
          ">

              <span className="text-lg font-semibold">
                Total
              </span>

              <div>

                <span className="text-xs text-gray-500 mr-2">
                  PKR
                </span>

                <span className="text-2xl font-bold">
                  Rs {total + shipping}
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Checkout;
