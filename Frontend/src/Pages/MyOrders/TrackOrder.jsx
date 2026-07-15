import React, {
  useEffect,
  useState
} from "react";

import axios from "axios";

import {
  useParams
} from "react-router-dom";

function TrackOrder() {

  const { id } =
    useParams();

  const [order,
    setOrder] =
    useState(null);

  const [loading,
    setLoading] =
    useState(true);

  useEffect(() => {

    fetchOrder();

  }, []);

  const fetchOrder =
    async () => {

      try {

        const res =
          await axios.get(

            `http://localhost:8080/api/orders/track/${id}`

          );

        setOrder(
          res.data.order
        );

      } catch (err) {

        console.log(err);

      } finally {

        setLoading(false);

      }

    };

  if (loading) {

    return (

      <div className="p-10">

        Loading...

      </div>

    );

  }

  if (!order) {

    return (

      <div className="p-10">

        Order Not Found

      </div>

    );

  }

  const currentStatus =
    order.orderStatus;

  const steps = [

    "Pending",

    "Processing",

    "Shipped",

    "Delivered"

  ];

  const currentIndex =
    steps.indexOf(
      currentStatus
    );

  return (

    <div
      className="
        min-h-screen
        bg-gray-100
        p-6
      "
    >

      <div
        className="
          max-w-4xl
          mx-auto
          bg-white
          rounded-xl
          shadow
          p-8
        "
      >
<div
  className="
    flex
    justify-between
    items-center
    mb-8
  "
>

  <div>

    <h1
      className="
        text-4xl
        font-bold
      "
    >
      Track Order
    </h1>

    <p
      className="
        text-gray-500
        mt-2
      "
    >
      Follow your order status
    </p>

  </div>

  <div
    className="
      bg-green-100
      text-green-700
      px-4
      py-2
      rounded-full
      font-semibold
    "
  >

    {order.orderStatus}

  </div>

</div>

        <p>

          Order ID:

          <span
            className="
              text-gray-500
              ml-2
            "
          >

            {order._id}

          </span>

        </p>

        <p className="mt-2">

          Total:

          <span
            className="
              text-green-600
              font-bold
              ml-2
            "
          >

            Rs {order.total}

          </span>

        </p>

        {/* TIMELINE */}

    {/* ORDER TRACKING */}

<div className="mt-12">

  <h2
    className="
      text-2xl
      font-bold
      mb-10
    "
  >
    Order Progress
  </h2>

  <div className="relative">

    {/* Background Line */}

    <div
      className="
        absolute
        top-5
        left-0
        right-0
        h-1
        bg-gray-300
      "
    />

    {/* Active Line */}

    <div

      className="
        absolute
        top-5
        left-0
        h-1
        bg-green-500
        transition-all
        duration-500
      "

      style={{

        width:

          currentIndex === 0
            ? "0%"

          : currentIndex === 1
            ? "33%"

          : currentIndex === 2
            ? "66%"

          : "100%"

      }}

    />

    <div
      className="
        relative
        flex
        justify-between
      "
    >

      {steps.map(

        (
          step,
          index
        ) => (

          <div

            key={step}

            className="
              flex
              flex-col
              items-center
            "

          >

            <div

              className={`

                w-12
                h-12
                rounded-full
                flex
                items-center
                justify-center
                text-white
                font-bold
                shadow-lg

                ${

                  index < currentIndex

                    ? "bg-green-500"

                  : index === currentIndex

                    ? "bg-blue-500"

                  : "bg-gray-400"

                }

              `}

            >

              {

                index < currentIndex

                  ? "✓"

                  : index + 1

              }

            </div>

            <p
              className="
                mt-3
                font-medium
              "
            >
              {step}
            </p>

          </div>

        )

      )}

    </div>

  </div>

</div>

        {/* PRODUCTS */}

        <div className="mt-10">

          <h2
            className="
              text-xl
              font-semibold
              mb-4
            "
          >

            Ordered Products

          </h2>

          {

            order.items?.map(

              (
                item,
                index
              ) => (

                <div

                  key={index}

                 className="
flex
items-center
gap-5
bg-gray-50
rounded-xl
p-4
mb-4
shadow-sm
"
                >

                  <img

                    src={item.image}

                    alt=""

                    className="
                      w-20
                      h-20
                      rounded
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

                    <p>

                      Qty:
                      {item.quantity}

                    </p>

                    <p>

                      Rs {item.price}

                    </p>

                  </div>

                </div>

              )

            )

          }

        </div>

      </div>

    </div>

  );

}

export default TrackOrder;