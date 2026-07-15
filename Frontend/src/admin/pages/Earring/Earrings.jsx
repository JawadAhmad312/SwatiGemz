import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  FiEdit,
  FiTrash2,
} from "react-icons/fi";

import {
  useNavigate,
} from "react-router-dom";

const Earrings = () => {

  const navigate =
    useNavigate();

  // STATES

  const [earrings, setEarrings] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("");

  const [earringPage, setEarringPage] =
    useState(1);

  const earringsPerPage = 8;

  // FETCH

  useEffect(() => {

    fetchEarrings();

  }, []);

 const fetchEarrings =
  async () => {

    try {

      const res =
        await axios.get(
          "http://localhost:8080/api/earrings"
        );


      setEarrings(

        res.data.earrings ||

        res.data.products ||

        res.data ||

        []
      );

    } catch (err) {

      console.log(err);

      setEarrings([]);
    }
  };

  // FILTER

  const filteredEarrings =
    earrings.filter((item) => {

      const matchesSearch =
        item.name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          );

      let matchesStatus = true;

      const stock =
        item.stockquantity || 0;

      if (statusFilter === "in") {

        matchesStatus =
          stock >= 10;
      }

      if (statusFilter === "low") {

        matchesStatus =
          stock > 0 &&
          stock < 10;
      }

      if (statusFilter === "out") {

        matchesStatus =
          stock === 0;
      }

      return (
        matchesSearch &&
        matchesStatus
      );
    });

  // PAGINATION

  const indexOfLastEarring =
    earringPage *
    earringsPerPage;

  const indexOfFirstEarring =
    indexOfLastEarring -
    earringsPerPage;

  const totalEarringPages =
    Math.ceil(
      filteredEarrings.length /
      earringsPerPage
    );

  // DELETE

  const handleDeleteEarring =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Delete this earring?"
        );

      if (!confirmDelete)
        return;

      try {

        await axios.delete(
          `http://localhost:8080/api/earrings/${id}`
        );

        fetchEarrings();

      } catch (err) {

        console.log(err);

      }
    };

  // EDIT

  const handleEditEarring =
    (id) => {

      navigate(
        `/admin/dashboard/edit-earring/${id}`
      );
    };

  // VIEW

  const handleView =
    (slug) => {

      navigate(
        `/earrings/${slug}`
      );
    };

  return (

    <div className="bg-white rounded-xl shadow">

      {/* TOP BAR */}

     <div className="
flex
flex-col
md:flex-row
p-4
justify-between
gap-3
mb-6
">

        {/* SEARCH */}

        <input
          type="text"
          placeholder="Search product name..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="
            border
            border-gray-400
            outline-none
            px-4
            py-2
            rounded-lg
           w-full md:w-64
          "
        />

        {/* FILTERS */}

       <div className="
grid
grid-cols-2
md:flex
gap-2
items-center
">

          <p className="text-gray-500 font-bold">
            Filter By:
          </p>

          {/* STATUS */}

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
            className="
              border
              rounded-lg
              border-gray-400
              outline-none
              px-3
              py-2
            "
          >

            <option value="">
              Status
            </option>

            <option value="in">
              In Stock
            </option>

            <option value="low">
              Low Stock
            </option>

            <option value="out">
              Out of Stock
            </option>

          </select>

          {/* ADD BUTTON */}

          <button
            onClick={() =>
              navigate(
                "/admin/dashboard/addearring"
              )
            }
           className="
  col-span-2
  md:col-span-1
  bg-[#d24a6b]
  text-white
  cursor-pointer
  px-4
  py-2
  rounded-lg
"
          >

            + Add Product

          </button>

        </div>

      </div>

      {/* TABLE HEADER */}

      <div className="
        hidden md:flex
        justify-between
        text-gray-600
        text-[12px]
        bg-gray-100
        border-b
        border-gray-300
        cursor-pointer
        font-bold
        py-2
        px-4
      ">

        <div className="w-[30%]">
          PRODUCT
        </div>

        <div className="w-[10%] text-start">
          CATEGORY
        </div>

        <div className="w-[10%] text-start">
          STOCK
        </div>

        <div className="w-[10%] text-start">
          PRICE
        </div>

        <div className="w-[10%] text-start">
          ORDERS
        </div>

        <div className="w-[10%] text-start">
          RATING
        </div>

        <div className="w-[10%] text-start">
          STATUS
        </div>

        <div className="w-[10%] text-center">
          ACTIONS
        </div>

      </div>

      {/* DATA */}

      {earrings.length === 0 ? (

        <p className="
          text-center
          text-gray-400
          mt-4
        ">

          No Earrings Found

        </p>

      ) : (

        filteredEarrings
          .slice(
            indexOfFirstEarring,
            indexOfLastEarring
          )
          .map((item) => {

            const stock =
              item.stockquantity || 0;

            let statusText =
              "In Stock";

            let statusColor =
              "bg-green-100 text-green-600";

            if (stock === 0) {

              statusText =
                "Out of Stock";

              statusColor =
                "bg-red-100 text-red-500";
            }

            else if (
              stock < 10
            ) {

              statusText =
                "Low Stock";

              statusColor =
                "bg-yellow-100 text-yellow-600";
            }

            return (

              <div
  key={item._id}
  className="
    flex
    flex-col
    md:flex-row
    md:justify-between
    md:items-center
    px-4
    border-b
    border-gray-300
    py-4
    gap-3
  "
>

                {/* PRODUCT */}

                <div className="
                  flex
                  items-center
                  gap-4
                 w-full md:w-[30%]
                ">

                  <img
                    src={item.image}
                    className="
                      w-12
                      h-12
                      rounded
                    "
                  />

                  <div>

                    <p className="text-[14px]">
                      {item.name}
                    </p>

                    <small className="text-gray-400">
                      By Admin
                    </small>

                  </div>

                </div>

                {/* CATEGORY */}

               <div className="w-full md:w-[10%] text-start">
  <span className="md:hidden font-semibold">
    Category:
  </span>{" "}

                  {item.category ||
                    "Earrings"}

                </div>

                {/* STOCK */}

                <div className="w-full md:w-[10%] text-start">

  <span className="md:hidden font-semibold">
    Stock:
  </span>{" "}

  {stock}

</div>

                {/* PRICE */}

                <div className="w-full md:w-[10%] text-start">

  <span className="md:hidden font-semibold">
    Price:
  </span>{" "}

  PKR {Number(item.price).toLocaleString()}

</div>
                {/* ORDERS */}

               <div className="w-full md:w-[10%] text-start">

  <span className="md:hidden font-semibold">
    Orders:
  </span>{" "}

  {item.orders || 0}

</div>

                {/* STATUS */}

               <div className="w-full md:w-[10%] text-start">

                  <span
                    className={`
                      px-3
                      py-1
                      rounded-full
                      text-sm
                      ${statusColor}
                    `}
                  >

                    {statusText}

                  </span>

                </div>

                {/* ACTIONS */}
<div className="
  w-full
  md:w-[10%]
  flex
  md:justify-center
  gap-2
">

                  {/* EDIT */}

                  <button
                    onClick={() =>
                      handleEditEarring(
                        item._id
                      )
                    }
                     className="
                          w-10
                          h-10
                          rounded-full
                          bg-blue-100
                          flex
                          items-center
                          justify-center
                          hover:bg-blue-200
                          transition
                        "
                  >

                    <FiEdit className="text-blue-600"/>

                  </button>

                  {/* DELETE */}

                  <button
                    onClick={() =>
                      handleDeleteEarring(
                        item._id
                      )
                    }
                    className="
                          w-10
                          h-10
                          rounded-full
                          bg-red-100
                          flex
                          items-center
                          justify-center
                          hover:bg-red-200
                          transition
                        "
                  >

                    <FiTrash2 className="text-red-600"/>

                  </button>

                </div>

              </div>
            );
          })
      )}

      {/* PAGINATION */}

      {earrings.length > 0 && (

        <div className="
          flex
          justify-between
          items-center
          mt-4
          px-4
          pb-2
        ">

          <p className="
            text-sm
            text-gray-400
          ">

            Showing
            {" "}

            {indexOfFirstEarring + 1}

            {" "}to{" "}

            {Math.min(
              indexOfLastEarring,
              filteredEarrings.length
            )}

            {" "}of{" "}

            {filteredEarrings.length}

            {" "}products

          </p>

          <div className="flex gap-2">

            {/* PREV */}

            <button
              onClick={() =>
                setEarringPage(
                  earringPage - 1
                )
              }
              disabled={
                earringPage === 1
              }
              className="
                border
                px-3
                py-1
                rounded
                disabled:opacity-50
              "
            >

              ‹

            </button>

            {/* PAGE NUMBERS */}

            {[...Array(
              totalEarringPages
            )].map((_, i) => (

              <button
                key={i}
                onClick={() =>
                  setEarringPage(
                    i + 1
                  )
                }
                className={`
                  px-3
                  py-1
                  rounded

                  ${earringPage ===
                    i + 1

                    ? "bg-blue-500 text-white"

                    : "border"
                  }
                `}
              >

                {i + 1}

              </button>
            ))}

            {/* NEXT */}

            <button
              onClick={() =>
                setEarringPage(
                  earringPage + 1
                )
              }
              disabled={
                earringPage ===
                totalEarringPages
              }
              className="
                border
                px-3
                py-1
                rounded
                disabled:opacity-50
              "
            >

              ›

            </button>

          </div>

        </div>
      )}

    </div>
  );
};

export default Earrings;