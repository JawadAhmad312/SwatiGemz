import React, { useEffect, useState } from "react";
import api from "../../lib/api";
import { Link } from "react-router-dom";

function MyOrders() {

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {

    fetchOrders();

  }, []);

  const fetchOrders = async () => {

    try {

     const userRes =
  await api.get("/current-user");

const email =
  userRes.data.user.email;   

      if (!email) {

        setError(
          "Please login first"
        );

        setLoading(false);

        return;
      }

     const res =
  await api.get(`/api/orders/customer/${email}`);

      setOrders(
        res.data.orders || []
      );

    } catch (err) {

      console.log(err);

      setError(
        "Login to see Your orders"
      );

    } finally {

      setLoading(false);

    }

  };

  const getStatusColor =
    (status) => {

      switch (status) {

        case "Pending":

          return "bg-yellow-500";

        case "Processing":

          return "bg-blue-500";

        case "Shipped":

          return "bg-purple-500";

        case "Delivered":

          return "bg-green-500";

        case "Cancelled":

          return "bg-red-500";

        default:

          return "bg-gray-500";

      }

    };

  if (loading) {

    return (

      <div className="p-10 text-center">

        Loading Orders...

      </div>

    );

  }

  return (

    <div className="min-h-screen bg-slate-50 p-8">

      <div className="max-w-6xl mx-auto">

        <h1
          className="
            text-3xl
            font-bold
            mb-6
          "
        >
          My Orders
        </h1>

        {error && (

          <div
            className="
              bg-red-100
              text-red-600
              p-4
              rounded-lg
            "
          >
            {error}
          </div>

        )}

        {!error &&
          orders.length === 0 && (

          <div
            className="
              bg-white
              rounded-xl
              shadow
              p-8
              text-center
            "
          >

            <h2
              className="
                text-xl
                font-semibold
                mb-2
              "
            >
              No Orders Found
            </h2>

            <p className="text-gray-500">

              You have not placed
              any orders yet.

            </p>

            <Link

              to="/"

              className="
                inline-block
                mt-5
                bg-black
                text-white
                px-5
                py-3
                rounded-lg
              "

            >

              Continue Shopping

            </Link>

          </div>

        )}

        <div className="space-y-5">

          {orders.map(order => (

            <div

              key={order._id}

              className="
                bg-white
                rounded-xl
                shadow
                p-6
              "

            >

             <div className="flex justify-between items-start mb-6">

  <div>

    <p className="text-gray-500 text-sm">
      Order ID
    </p>

   <h3 className="font-bold text-xl">
  {order.orderNumber}
</h3>

    <p className="text-gray-500 mt-1">
      {new Date(order.createdAt).toLocaleDateString()}
    </p>

  </div>

  <span

    className={`

      px-4
      py-2
      rounded-full
      text-white
      font-semibold

      ${getStatusColor(
        order.orderStatus
      )}

    `}

  >

    {order.orderStatus}

  </span>

</div>
           <div className="grid md:grid-cols-3 gap-6 mb-6">

  <div className="bg-gray-50 p-4 rounded-xl">

    <p className="text-gray-500">
      Payment Method
    </p>

    <h4 className="font-semibold">
      {order.paymentMethod}
    </h4>

  </div>

  <div className="bg-gray-50 p-4 rounded-xl">

    <p className="text-gray-500">
      Items
    </p>

    <h4 className="font-semibold">
      {order.items?.length}
    </h4>

  </div>

  <div className="bg-gray-50 p-4 rounded-xl">

    <p className="text-gray-500">
      Total Charges
    </p>

    <h4 className="font-bold text-green-600">
      Rs {Number(order.total).toLocaleString()}
    </h4>

  </div>

</div>
<div className="flex justify-end mb-6">

  <Link

    to={`/track-order/${order._id}`}

    className="
      bg-black
      text-white
      px-5
      py-3
      rounded-xl
      hover:bg-gray-800
      transition
    "

  >

    🚚 Track Order

  </Link>

</div>
              <div className="mt-6">

                <h4
                  className="
                    font-semibold
                    mb-3
                  "
                >
                  Products
                </h4>

                <div className="space-y-3">

                  {order.items?.map(
                    (item, index) => (

                      <div

                        key={index}

                       className="
  flex
  items-center
  gap-5
  bg-gray-50
  rounded-xl
  p-4
  shadow-sm
"

                      >

                        <img

                          src={item.image}

                          alt=""

                         className="
  w-24
  h-24
  object-cover
  rounded-xl
"

                        />

                        <div>

                          <p
                            className="
                              font-medium
                            "
                          >
                            {item.name}
                          </p>

                          <p
                            className="
                              text-sm
                              text-gray-500
                            "
                          >
                            Quantity:
                            {" "}
                            {item.quantity}
                          </p>

                          <p className="text-sm text-gray-500">
  PKR {Number(item.price).toLocaleString()}
</p>

                        </div>

                      </div>

                    )
                  )}

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  );

}

export default MyOrders;
