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

const Rings = () => {

  const navigate =
    useNavigate();

  // STATES

  const [rings, setRings] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [categoryFilter, setCategoryFilter] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("");

  const [priceFilter, setPriceFilter] =
    useState("");

  const [ringPage, setRingPage] =
    useState(1);

  const ringsPerPage = 8;

  // FETCH DATA

  useEffect(() => {

    fetchRings();

  }, []);

  const fetchRings =
    async () => {

      try {

        const res =
          await axios.get(
            "http://localhost:8080/api/menrings"
          );

        setRings(

          res.data.rings ||

          res.data.products ||

          res.data ||

          []
        );

      } catch (err) {

        console.log(err);

        setRings([]);
      }
    };

  // DELETE

  const handleDelete =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Delete this ring?"
        );

      if (!confirmDelete)
        return;

      try {

        await axios.delete(
          `http://localhost:8080/api/menrings/${id}`
        );

        fetchRings();

      } catch (err) {

        console.log(err);

      }
    };

  // VIEW

  const handleView =
    (id) => {

      navigate(
        `/admin/dashboard/view-ring/${id}`
      );
    };

  // EDIT

  const handleEdit =
    (id) => {

      navigate(
        `/admin/dashboard/edit/${id}`
      );
    };

  // FILTERS

  const filteredRings =
    (rings || []).filter(
      (item) => {

        const matchesSearch =
          item.name
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            );

        const matchesCategory =

          categoryFilter === ""

            ? true

            : item.category ===
            categoryFilter;

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

        let matchesPrice = true;

        if (priceFilter) {

          const [
            min,
            max,
          ] =
            priceFilter
              .split("-")
              .map(Number);

          matchesPrice =
            item.price >= min &&
            item.price <= max;
        }

        return (

          matchesSearch &&

          matchesCategory &&

          matchesStatus &&

          matchesPrice
        );
      }
    );

  // PAGINATION

  const indexOfLastItem =
    ringPage *
    ringsPerPage;

  const indexOfFirstItem =
    indexOfLastItem -
    ringsPerPage;

  const currentRings =
    filteredRings.slice(

      indexOfFirstItem,

      indexOfLastItem
    );

  const totalPages =
    Math.ceil(
      filteredRings.length /
      ringsPerPage
    );

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
            setSearch(
              e.target.value
            )
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

          {/* CATEGORY */}

          <select
            value={categoryFilter}
            onChange={(e) =>
              setCategoryFilter(
                e.target.value
              )
            }
            className="
              border
              border-gray-400
              outline-none
              px-3
              py-2
              rounded-lg
            "
          >

            <option value="">
              Category
            </option>

            <option value="Ring">
              Ring
            </option>

          </select>

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

          {/* PRICE */}

          <select
            value={priceFilter}
            onChange={(e) =>
              setPriceFilter(
                e.target.value
              )
            }
            className="
              border
              border-gray-400
              outline-none
              px-3
              py-2
              rounded-lg
            "
          >

            <option value="">
              Price Range
            </option>

            <option value="0-5000">
              0 - 5k
            </option>

            <option value="5000-10000">
              5k - 10k
            </option>

          </select>

          {/* ADD BUTTON */}

          <button
            onClick={() =>
              navigate(
                "/admin/dashboard/addring"
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

      {rings.length === 0 ? (

        <p className="
          text-center
          text-gray-400
          mt-4
        ">

          No Rings Found

        </p>

      ) : (

        currentRings.map(
          (item) => {

            const stock =
              item.stockquantity || 0;

            let statusText =
              "Published";

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
  w-full
  md:w-[30%]
">

                  <img
                    src={item.image}
                    className="
                      w-12
                      h-12
                      rounded
                      object-cover
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

  {item.category || "Ring"}

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

                  {Math.floor(
                    Math.random() * 200
                  )}

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
                      handleEdit(
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

                    <FiEdit  className="text-blue-600"/>

                  </button>

                  {/* DELETE */}

                  <button
                    onClick={() =>
                      handleDelete(
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
          }
        )
      )}

      {/* PAGINATION */}

      {filteredRings.length > 0 && (

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

            {indexOfFirstItem + 1}

            {" "}to{" "}

            {Math.min(

              indexOfLastItem,

              filteredRings.length
            )}

            {" "}of{" "}

            {filteredRings.length}

            {" "}products

          </p>

          <div className="flex gap-2">

            {/* PREV */}

            <button
              onClick={() =>
                setRingPage(
                  ringPage - 1
                )
              }
              disabled={
                ringPage === 1
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

            {[...Array(totalPages)]
              .map((_, i) => (

                <button
                  key={i}
                  onClick={() =>
                    setRingPage(
                      i + 1
                    )
                  }
                  className={`
                    px-3
                    py-1
                    rounded

                    ${ringPage ===
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
                setRingPage(
                  ringPage + 1
                )
              }
              disabled={
                ringPage ===
                totalPages
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

export default Rings;