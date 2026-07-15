import React from "react";
import { Link, useLocation } from "react-router-dom";

function OrderSuccess() {

  const { state } =
    useLocation();

  const order =
    state?.order || {};

  const items =
    order.items || [];

  return (

    <div className="min-h-screen bg-gray-100 py-12 px-4">

      <div className="max-w-5xl mx-auto">

        {/* SUCCESS CARD */}

        <div className="bg-white rounded-3xl shadow-xl p-10">

          <div className="text-center">

            <div
              className="
                w-20 h-20
                mx-auto
                rounded-full
                bg-green-100
                flex
                items-center
                justify-center
                text-4xl
                text-green-600
                mb-5
              "
            >
              ✓
            </div>

            <h1
              className="
                text-4xl
                font-bold
                mb-2
              "
            >
              Order Confirmed
            </h1>

            <p className="text-gray-500">

              Thank you for shopping with
              {" "}
              <span className="font-semibold">
                Swati Gemz
              </span>

            </p>

            <p
              className="
                mt-3
                text-sm
                text-gray-400
              "
            >
              Order ID:
              {" "}
              {order._id}
            </p>

          </div>

          {/* ITEMS */}

          <div
            className="
              mt-10
              bg-gray-50
              rounded-2xl
              p-6
            "
          >

            <h2
              className="
                text-xl
                font-semibold
                mb-5
              "
            >
              Order Summary
            </h2>

            {items.length === 0 ? (

              <p>No Items Found</p>

            ) : (

              items.map(item => (

                <div

                  key={item._id}

                  className="
                    flex
                    justify-between
                    items-center
                    py-4
                    border-b
                  "
                >

                  <div
                    className="
                      flex
                      gap-4
                      items-center
                    "
                  >

                    <img
                      src={item.image}
                      alt=""
                      className="
                        w-20
                        h-20
                        rounded-xl
                        object-cover
                      "
                    />

                    <div>

                      <h3
                        className="
                          font-semibold
                        "
                      >
                        {item.name}
                      </h3>

                      <p
                        className="
                          text-sm
                          text-gray-500
                        "
                      >
                        Qty:
                        {" "}
                        {item.quantity}
                      </p>

                    </div>

                  </div>

                  <div
                    className="
                      font-bold
                    "
                  >
                    Rs {" "}
                    {(item.price *
                      item.quantity)
                      .toLocaleString()}
                  </div>

                </div>

              ))
            )}

          </div>

          {/* SHIPPING */}

          <div
            className="
              mt-8
              bg-gray-50
              rounded-2xl
              p-6
            "
          >

            <h2
              className="
                text-xl
                font-semibold
                mb-4
              "
            >
              Shipping Information
            </h2>

            <div className="space-y-2">

              <p>

                <strong>Name:</strong>
                {" "}
                {order.shippingAddress?.firstName}
                {" "}
                {order.shippingAddress?.lastName}

              </p>

              <p>

                <strong>Address:</strong>
                {" "}
                {order.shippingAddress?.address}

              </p>

              <p>

                <strong>City:</strong>
                {" "}
                {order.shippingAddress?.city}

              </p>

              <p>

                <strong>Phone:</strong>
                {" "}
                {order.shippingAddress?.phone}

              </p>

            </div>

          </div>

          {/* PAYMENT */}

          <div
            className="
              mt-8
              border-t
              pt-8
            "
          >

            <div
              className="
                flex
                justify-between
                text-lg
                mb-3
              "
            >
              <span>Subtotal</span>

              <span>
                Rs {order.subtotal || 0}
              </span>
            </div>

            <div
              className="
                flex
                justify-between
                text-lg
                mb-3
              "
            >
              <span>Shipping</span>

              <span>
                Rs {order.shipping || 0}
              </span>
            </div>

            <div
              className="
                flex
                justify-between
                text-2xl
                font-bold
                text-green-600
              "
            >
              <span>Total Charges</span>

              <span>
                Rs {" "}
                {order.total
                  ?.toLocaleString()}
              </span>

            </div>

          </div>

          {/* BUTTON */}

          <div className="mt-10 text-center">

            <Link

              to="/"

              className="
                inline-block
                px-8
                py-4
                bg-black
                text-white
                rounded-xl
                hover:bg-gray-800
              "
            >
              Continue Shopping
            </Link>

          </div>

        </div>

      </div>

    </div>

  );
}

export default OrderSuccess;