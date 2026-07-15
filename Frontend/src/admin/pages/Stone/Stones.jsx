import {
  useEffect,
  useState,
} from "react";

import {
  FiEdit,
  FiTrash2,
} from "react-icons/fi";

import {
  useNavigate,
} from "react-router-dom";

const Stones = () => {

  const navigate =
    useNavigate();

  // STATES

  const [stone, setStone] =
    useState([]);

  const [stonePage,
    setStonePage] =
    useState(1);

  const [search,
    setSearch] =
    useState("");

  const [categoryFilter,
    setCategoryFilter] =
    useState("");

  const [statusFilter,
    setStatusFilter] =
    useState("");

  const [priceFilter,
    setPriceFilter] =
    useState("");

  const itemsPerPage = 12;

  const indexOfLastStone =
    stonePage *
    itemsPerPage;

  const indexOfFirstStone =
    indexOfLastStone -
    itemsPerPage;

  const currentStones =
    stone.slice(
      indexOfFirstStone,
      indexOfLastStone
    );

  const totalStonePages =
    Math.ceil(
      stone.length /
      itemsPerPage
    );

  // FETCH STONES

  useEffect(() => {

    fetch(
      "http://localhost:8080/api/stone"
    )

      .then(res =>
        res.json()
      )

      .then(data => {

        setStone(data);

      })

      .catch(err =>
        console.error(
          "STONE ERROR:",
          err
        )
      );

  }, []);

  // SCROLL

  useEffect(() => {

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  }, [stonePage]);

  // DELETE

  const handleDeleteStone =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Are you sure?"
        );

      if (!confirmDelete)
        return;

      try {

        const res =
          await fetch(
            `http://localhost:8080/api/stone/${id}`,
            {
              method:
                "DELETE",
            }
          );

        const data =
          await res.json();

        if (res.ok) {

          alert(
            "Deleted successfully ✅"
          );

          setStone(
            (prev) =>
              prev.filter(
                (item) =>
                  item._id !== id
              )
          );

        } else {

          alert(
            data.message
          );
        }

      } catch (err) {

        console.error(err);

        alert("Error ❌");
      }
    };

  // EDIT

  const handleEditStone =
    async (id) => {

      navigate(
        `/admin/dashboard/edit-stone/${id}`
      );
    };

  // VIEW

  const handleView =
    (id) => {

      navigate(
        `/admin/dashboard/view/${id}`
      );
    };

  // FILTER

  const filteredStones =
    stone.filter((item) => {

      // SEARCH

      const matchesSearch =

        item.name
          ?.toLowerCase()

          .includes(
            search.toLowerCase()
          );

      // CATEGORY

      const matchesCategory =

        categoryFilter === "" ||

        item.category
          ?.toLowerCase() ===

        categoryFilter.toLowerCase();

      // STOCK

      const stock =
        item.stockquantity || 0;

      // STATUS

      const matchesStatus =
        (() => {

          if (
            statusFilter === ""
          )
            return true;

          if (
            statusFilter ===
            "in"
          )
            return stock >= 10;

          if (
            statusFilter ===
            "low"
          )
            return (
              stock > 0 &&
              stock < 10
            );

          if (
            statusFilter ===
            "out"
          )
            return stock === 0;

          return true;

        })();

      // PRICE

      let matchesPrice =
        true;

      if (
        priceFilter ===
        "0-5000"
      ) {

        matchesPrice =
          item.price >= 0 &&

          item.price <= 5000;
      }

      else if (
        priceFilter ===
        "5000-10000"
      ) {

        matchesPrice =
          item.price > 5000 &&

          item.price <= 10000;
      }

      return (

        matchesSearch &&

        matchesCategory &&

        matchesStatus &&

        matchesPrice
      );
    });

  // CATEGORIES

  const categories = [

    ...new Set(

      stone.map(
        item =>
          item.category
      )
    )
  ];

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
            value={
              categoryFilter
            }

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
              All Categories
            </option>

            {categories.map(
              (
                cat,
                index
              ) => (

                <option
                  key={index}
                  value={cat}
                >

                  {cat}

                </option>
              )
            )}

          </select>

          {/* STATUS */}

          <select
            value={
              statusFilter
            }

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
            value={
              priceFilter
            }

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
                "/admin/dashboard/addstone"
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

      {stone.length === 0 ? (

        <p className="
          text-center
          text-gray-400
          mt-4
        ">

          No Stones Found

        </p>

      ) : (

        filteredStones

          .slice(
            indexOfFirstStone,
            indexOfLastStone
          )

          .map((item) => {

            const stock =
              item.stockquantity || 0;

            let statusText =
              "In Stock";

            let statusColor =
              "bg-green-100 text-green-600";

            if (
              stock === 0
            ) {

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

                  {item.category || ""}

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
     Order:
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
                      handleEditStone(
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

                    <FiEdit  className="text-blue-600" />

                  </button>

                  {/* DELETE */}

                  <button
                    onClick={() =>
                      handleDeleteStone(
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

                    <FiTrash2 className="text-red-600" />

                  </button>

                </div>

              </div>
            );
          })
      )}

      {/* PAGINATION */}

      {stone.length > 0 && (

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

            {indexOfFirstStone + 1}

            {" "}to{" "}

            {Math.min(
              indexOfLastStone,
              stone.length
            )}

            {" "}of{" "}

            {stone.length}

            {" "}products

          </p>

          <div className="flex gap-2">

            {/* PREV */}

            <button
              onClick={() =>
                setStonePage(
                  stonePage - 1
                )
              }

              disabled={
                stonePage === 1
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
              totalStonePages
            )].map((_, i) => (

              <button
                key={i}

                onClick={() =>
                  setStonePage(
                    i + 1
                  )
                }

                className={`
                  px-3
                  py-1
                  rounded

                  ${stonePage ===
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
                setStonePage(
                  stonePage + 1
                )
              }

              disabled={
                stonePage ===
                totalStonePages
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

export default Stones;