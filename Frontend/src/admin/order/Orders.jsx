import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  useReactToPrint
}
from "react-to-print";
import jsPDF from "jspdf";
import html2canvas
from "html2canvas-pro";
import { useRef } from "react";
function Orders() {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedOrder,
    setSelectedOrder] =
    useState(null);
    const invoiceRef =
  useRef();
  const handlePrint =useReactToPrint({

    content: () =>

      invoiceRef.current

  });

  const downloadPDF =
  async () => {

    const input =
      invoiceRef.current;

   const canvas =
  await html2canvas(
    input,
    {
      backgroundColor:
        "#ffffff",

      scale: 2,

      useCORS: true
    }
  );

    const imgData =
      canvas.toDataURL(
        "image/png"
      );

    const pdf =
      new jsPDF(
        "p",
        "mm",
        "a4"
      );

    const pdfWidth =
      pdf.internal.pageSize.getWidth();

    const imgWidth =
      pdfWidth - 20;

    const imgHeight =
      (canvas.height *
        imgWidth) /
      canvas.width;

    pdf.addImage(

      imgData,

      "PNG",

      10,

      10,

      imgWidth,

      imgHeight

    );

    pdf.save(

      `Order-${selectedOrder?._id}.pdf`

    );

  };
  
  const [currentPage, setCurrentPage] =
    useState(1);

  const ordersPerPage = 10;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {

      const res = await axios.get(
        "http://localhost:8080/api/orders"
      );

      setOrders(
        res.data.orders || []
      );

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }
  };

  const updateStatus = async (
    id,
    status
  ) => {

    try {

      await axios.put(

        `http://localhost:8080/api/orders/${id}`,

        {
          orderStatus: status
        }

      );

      fetchOrders();

    } catch (err) {

      console.log(err);

    }
  };

  const deleteOrder = async (
    id
  ) => {

    if (
      !window.confirm(
        "Delete Order?"
      )
    )
      return;

    try {

      await axios.delete(

        `http://localhost:8080/api/orders/${id}`

      );

      fetchOrders();

    } catch (err) {

      console.log(err);

    }
  };

  const filteredOrders =
    orders.filter(order =>

      order?._id
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        ) ||

      order?.shippingAddress
        ?.firstName
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        ) ||

      order?.shippingAddress
        ?.email
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )

    );

  const indexOfLast =
    currentPage *
    ordersPerPage;

  const indexOfFirst =
    indexOfLast -
    ordersPerPage;

  const currentOrders =
    filteredOrders.slice(

      indexOfFirst,

      indexOfLast

    );

  const totalPages =
    Math.ceil(

      filteredOrders.length /
      ordersPerPage

    );

  const revenue =
    orders.reduce(

      (sum, order) =>

        sum +
        Number(order.total || 0),

      0

    );

  if (loading) {

    return (

      <div className="p-10">
        Loading Orders...
      </div>

    );
  }

  return (

  <div className="p-3 md:p-6 w-full">

     <h1 className="text-2xl md:text-3xl font-bold mb-6">
        Orders Management
      </h1>

      {/* STATS */}

      <div
        className="
          grid
grid-cols-2
lg:grid-cols-4
          gap-4
          mb-6
        "
      >

        <div
         className="
bg-white
p-4
md:p-5
rounded-xl
shadow
"
        >
          <p>Total Orders</p>

          <h2
            className="
              text-3xl
              font-bold
            "
          >
            {orders.length}
          </h2>
        </div>

        <div
          className="
            bg-white
            p-5
            rounded-xl
            shadow
          "
        >
          <p>Pending</p>

          <h2
            className="
              text-3xl
              font-bold
              text-yellow-500
            "
          >
            {
              orders.filter(

                o =>
                  o.orderStatus ===
                  "Pending"

              ).length
            }
          </h2>
        </div>

        <div
          className="
            bg-white
            p-5
            rounded-xl
            shadow
          "
        >
          <p>Delivered</p>

          <h2
            className="
              text-3xl
              font-bold
              text-green-600
            "
          >
            {
              orders.filter(

                o =>
                  o.orderStatus ===
                  "Delivered"

              ).length
            }
          </h2>
        </div>

        <div
          className="
            bg-white
            p-5
            rounded-xl
            shadow
          "
        >
          <p>Revenue</p>

          <h2
            className="
              text-2xl
              font-bold
            "
          >
            Rs.
            {revenue.toLocaleString()}
          </h2>
        </div>

      </div>

      {/* SEARCH */}

      <input

        type="text"

        placeholder="Search Orders..."

        value={search}

        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }

       className="
w-full
md:w-96
border
rounded-lg
p-3
mb-5
outline-none
border-gray-400
"

      />

      {/* TABLE */}

     <div className="hidden md:block bg-white rounded-xl shadow overflow-x-auto">

        <table className="w-full">

          <thead
            className="
              bg-gray-100
            "
          >

            <tr>

              <th className="p-4 text-start">
                Customer
              </th>

              <th className="p-4 text-start">
                Total
              </th>

              <th className="p-4 text-start">
                Payment
              </th>

              <th className="p-4 text-start">
                Status
              </th>

              <th className="p-4 text-start">
                Date
              </th>

              <th className="p-4 text-center">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {currentOrders.map(
              order => (

                <tr
                  key={order._id}
                  className="border-b border-gray-400"
                >

                  <td className="p-4">

                    <p className="font-semibold">

                      {
                        order
                          ?.shippingAddress
                          ?.firstName
                      }

                      {" "}

                      {
                        order
                          ?.shippingAddress
                          ?.lastName
                      }

                    </p>

                    <p
                      className="
                        text-sm
                        text-gray-500
                      "
                    >

                      {
                        order
                          ?.shippingAddress
                          ?.email
                      }

                    </p>

                  </td>

                  <td className="p-4">

                    Rs.
                    {Number(
                      order.total
                    ).toLocaleString()}

                  </td>

                  <td className="p-4">

                    {
                      order.paymentMethod
                    }

                  </td>

                  <td className="p-4 ">

                    <select

                      value={
                        order.orderStatus
                      }

                      onChange={(e) =>

                        updateStatus(

                          order._id,

                          e.target.value

                        )

                      }

                      className="
                        border
                        rounded
                        p-2
                        outline-none
                        border-gray-400
                      "

                    >

                      <option>
                        Pending
                      </option>

                      <option>
                        Processing
                      </option>

                      <option>
                        Shipped
                      </option>

                      <option>
                        Delivered
                      </option>

                      <option>
                        Cancelled
                      </option>

                    </select>

                  </td>

                  <td className="p-4">

                    {
                      new Date(

                        order.createdAt

                      ).toLocaleDateString()

                    }

                  </td>

                  <td className="p-4 ">
                    <button
                      onClick={() =>
                        setSelectedOrder(order)
                      }
                      className="
    bg-blue-500
    text-white
    px-3
    py-2
    mx-4
    rounded
  "
                    >
                      View
                    </button>
                    <button

                      onClick={() =>

                        deleteOrder(
                          order._id
                        )

                      }

                      className="
                        bg-red-500
                        text-white
                        px-3
                        py-2
                        rounded
                      "

                    >

                      Delete

                    </button>

                  </td>

                </tr>

              )

            )}

          </tbody>

        </table>

      </div>
{/* MOBILE VIEW */}

<div className="md:hidden space-y-4">

{currentOrders.map((order)=>(

<div
key={order._id}
className="bg-white rounded-xl shadow p-4 border"
>

<div className="flex flex-col gap-3">

<div>

<h3 className="font-bold text-lg">

{order.shippingAddress?.firstName}{" "}
{order.shippingAddress?.lastName}

</h3>

<p className="text-gray-500 text-sm">

{order.shippingAddress?.email}

</p>

</div>

<select
  value={order.orderStatus}
  onChange={(e) =>
    updateStatus(order._id, e.target.value)
  }
  className="
    w-28
    text-xs
    border
    rounded-md
    px-2
    py-1
    outline-none
    bg-white
  "
>
  <option>Pending</option>
  <option>Processing</option>
  <option>Shipped</option>
  <option>Delivered</option>
  <option>Cancelled</option>
</select>

</div>

<div className="mt-4 space-y-2">

<div className="flex justify-between">

<span className="font-semibold">
Total
</span>

<span>

PKR {Number(order.total).toLocaleString()}

</span>

</div>

<div className="flex justify-between">

<span className="font-semibold">
Payment
</span>

<span>

{order.paymentMethod}

</span>

</div>

<div className="flex justify-between">

<span className="font-semibold">
Date
</span>

<span>

{new Date(order.createdAt).toLocaleDateString()}

</span>

</div>

</div>

<div className="flex gap-3 mt-5">

<button

onClick={()=>setSelectedOrder(order)}

className="
flex-1
bg-blue-500
text-white
py-2
rounded-lg
"

>

View

</button>

<button

onClick={()=>deleteOrder(order._id)}

className="
flex-1
bg-red-500
text-white
py-2
rounded-lg
"

>

Delete

</button>

</div>

</div>

))}

</div>
      {/* PAGINATION */}

      <div
        className="
          flex
          justify-center
          gap-2
          mt-6
        "
      >

        {[...Array(totalPages)]
          .map((_, i) => (

            <button

              key={i}

              onClick={() =>

                setCurrentPage(
                  i + 1
                )

              }

              className={`

                px-4
                py-2
                rounded

                ${currentPage ===
                  i + 1

                  ? "bg-black text-white"

                  : "bg-gray-200"

                }

              `}

            >

              {i + 1}

            </button>

          ))}

      </div>
{selectedOrder && (

  <div
    className="
      fixed
      inset-0
      bg-black/50
      flex
      items-center
      justify-center
      z-50
    "
  >

    <div
     ref={invoiceRef}
     style={{
  background: "#ffffff",
  color: "#000000"
}}

      className="
        bg-white
        p-6
        rounded-xl
        w-[700px]
        max-h-[90vh]
        overflow-y-auto
      "
    >

      <h2
        className="
          text-2xl
          font-bold
          mb-4
        "
      >
        Order Details
      </h2>

      <p>
        <strong>Name:</strong>{" "}
        {selectedOrder?.shippingAddress?.firstName}
        {" "}
        {selectedOrder?.shippingAddress?.lastName}
      </p>

      <p>
        <strong>Email:</strong>{" "}
        {selectedOrder?.shippingAddress?.email}
      </p>

      <p>
        <strong>Phone:</strong>{" "}
        {selectedOrder?.shippingAddress?.phone}
      </p>

      <p>
        <strong>Address:</strong>{" "}
        {selectedOrder?.shippingAddress?.address}
      </p>

      <p>
        <strong>City:</strong>{" "}
        {selectedOrder?.shippingAddress?.city}
      </p>

      <p>
        <strong>Payment:</strong>{" "}
        {selectedOrder?.paymentMethod}
      </p>

     <div className="mt-3">

  <span
    className={`

      px-3
      py-1
      rounded-full
      text-white
      text-sm

      ${

        selectedOrder
          ?.orderStatus ===
        "Pending"

          ? "bg-yellow-500"

        : selectedOrder
            ?.orderStatus ===
          "Processing"

          ? "bg-blue-500"

        : selectedOrder
            ?.orderStatus ===
          "Shipped"

          ? "bg-purple-500"

        : selectedOrder
            ?.orderStatus ===
          "Delivered"

          ? "bg-green-500"

        : "bg-red-500"

      }

    `}
  >

    {
      selectedOrder
        ?.orderStatus
    }

  </span>

</div>
<div className="mt-6">

  <h3
    className="
      font-bold
      mb-4
    "
  >
    Order Progress
  </h3>

  <div
    className="
      flex
      items-center
      gap-4
    "
  >

    <div>📦 Pending</div>

    <div>⚙ Processing</div>

    <div>🚚 Shipped</div>

    <div>✅ Delivered</div>

  </div>

</div>
      <p>
        <strong>Total:</strong>
        {" "}
        Rs {selectedOrder?.total}
      </p>

      <h3
        className="
          text-lg
          font-semibold
          mt-5
          mb-3
        "
      >
        Products
      </h3>

      {selectedOrder?.items?.map(
        (item, index) => (

          <div

            key={index}

            className="
              flex
              items-center
              gap-4
              border-b
              py-3
            "

          >

            <img

              src={item.image}

              alt=""

              className="
                w-16
                h-16
                object-cover
                rounded
              "

            />

            <div>

              <p className="font-medium">
                {item.name}
              </p>

               <p
    className="
      text-sm
      text-gray-500
    "
  >
    Quantity:
    {item.quantity}
  </p>

              <p>
                Rs {item.price}
              </p>

            </div>

          </div>

        )
      )}
<div className="flex gap-3 mt-6">

  <button

    onClick={handlePrint}

    className="
      bg-green-600
      text-white
      px-4
      py-2
      rounded
      cursor-pointer
    "

  >

    Print Invoice

  </button>
<button

  onClick={downloadPDF}

  className="
    bg-blue-600
    text-white
    px-4
    py-2
    rounded
  "

>

  Download PDF

</button>
</div>
      <button

        onClick={() =>
          setSelectedOrder(null)
        }

        className="
          mt-6
          bg-red-500
          text-white
          px-4
          py-2
          rounded
        "

      >

        Close

      </button>

    </div>

  </div>

)}
    </div>

  );

}

export default Orders;