import React, { useState } from "react";
import {
  FiFilter,
  FiX,
  FiChevronRight,
  FiChevronLeft,
} from "react-icons/fi";

const MobileFilter = ({
  filters,
  setFilters,
  categories = [],
  totalProducts = 0,
}) => {

  const [open, setOpen] = useState(false);

  const [screen, setScreen] = useState("main");

  const [tempFilters, setTempFilters] = useState({
    ...filters,
  });

  /* ---------------- OPEN ---------------- */

  const openDrawer = () => {
    setTempFilters(filters);
    setScreen("main");
    setOpen(true);
  };

  /* ---------------- CLOSE ---------------- */

  const closeDrawer = () => {
    setOpen(false);

    setTimeout(() => {
      setScreen("main");
    }, 250);
  };

  /* ---------------- APPLY ---------------- */

  const applyFilters = () => {
    setFilters(tempFilters);
    closeDrawer();
  };

  /* ---------------- CLEAR ---------------- */

  const clearFilters = () => {
    setTempFilters({
      category: "All",
      availability: "all",
      sort: "default",
      minPrice: "",
      maxPrice: "",
    });
  };

  return (
    <>
      {/* ================================================= */}
      {/* MOBILE TOP BAR */}
      {/* ================================================= */}

      <div className="md:hidden flex items-center justify-between mb-5">

        <button
          onClick={openDrawer}
          className="
            flex
            items-center
            gap-2
            border
            rounded-full
            px-5
            py-2.5
            font-medium
            text-sm
            shadow-sm
            bg-white
          "
        >
          <FiFilter size={18} />
          Filter & Sort
        </button>

        <p className="text-sm text-gray-500">
          {totalProducts} Products
        </p>

      </div>

      {/* ================================================= */}
      {/* OVERLAY */}
      {/* ================================================= */}

      {open && (
        <div
          onClick={closeDrawer}
          className="
            fixed
            inset-0
            bg-black/40
            z-40
          "
        />
      )}

      {/* ================================================= */}
      {/* DRAWER */}
      {/* ================================================= */}

      <div
        className={`
          fixed
          top-0
          left-0
          h-screen
          w-full
          bg-white
          z-50
          transition-transform
          duration-300
          ${
            open
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >

        {/* ===================================== */}
        {/* HEADER */}
        {/* ===================================== */}

        <div
          className="
            h-16
            border-b
            px-5
            flex
            items-center
            justify-between
          "
        >

          <div className="flex items-center gap-3">

            {screen !== "main" && (

              <button
                onClick={() =>
                  setScreen("main")
                }
              >
                <FiChevronLeft
                  size={22}
                />
              </button>

            )}

            <h2 className="font-semibold text-lg">

              {screen === "main" &&
                "Filter & Sort"}

              {screen === "category" &&
                "Category"}

              {screen === "availability" &&
                "Availability"}

              {screen === "price" &&
                "Price"}

              {screen === "sort" &&
                "Sort By"}

            </h2>

          </div>

          <button
            onClick={closeDrawer}
          >
            <FiX size={24} />
          </button>

        </div>

        {/* ===================================== */}
        {/* BODY */}
        {/* ===================================== */}

        <div
          className="
            h-[calc(100vh-140px)]
            overflow-y-auto
          "
        >

          {/* Next Part */}
{/* ===================================== */}
{/* MAIN FILTER MENU */}
{/* ===================================== */}

{screen === "main" && (
  <div className="divide-y">

    {/* CATEGORY */}
    <button
      onClick={() => setScreen("category")}
      className="
        w-full
        px-5
        py-5
        flex
        justify-between
        items-center
        hover:bg-gray-50
        transition
      "
    >
      <div className="text-left">

        <p className="font-medium text-gray-900">
          Category
        </p>

        <p className="text-sm text-gray-400 mt-1">
          {tempFilters.category === "All"
            ? "All Categories"
            : tempFilters.category}
        </p>

      </div>

      <FiChevronRight size={22} />

    </button>

    {/* AVAILABILITY */}

    <button
      onClick={() => setScreen("availability")}
      className="
        w-full
        px-5
        py-5
        flex
        justify-between
        items-center
        hover:bg-gray-50
        transition
      "
    >

      <div className="text-left">

        <p className="font-medium text-gray-900">
          Availability
        </p>

        <p className="text-sm text-gray-400 mt-1">

          {tempFilters.availability === "all"
            ? "All Products"
            : tempFilters.availability === "inStock"
            ? "In Stock"
            : "Out Of Stock"}

        </p>

      </div>

      <FiChevronRight size={22} />

    </button>

    {/* PRICE */}

    <button
      onClick={() => setScreen("price")}
      className="
        w-full
        px-5
        py-5
        flex
        justify-between
        items-center
        hover:bg-gray-50
        transition
      "
    >

      <div className="text-left">

        <p className="font-medium text-gray-900">
          Price
        </p>

        <p className="text-sm text-gray-400 mt-1">

          {tempFilters.minPrice === "" &&
          tempFilters.maxPrice === ""
            ? "Any Price"
            : `PKR ${tempFilters.minPrice || 0}
               -
               PKR ${tempFilters.maxPrice || "∞"}`}

        </p>

      </div>

      <FiChevronRight size={22} />

    </button>

    {/* SORT */}

    <button
      onClick={() => setScreen("sort")}
      className="
        w-full
        px-5
        py-5
        flex
        justify-between
        items-center
        hover:bg-gray-50
        transition
      "
    >

      <div className="text-left">

        <p className="font-medium text-gray-900">
          Sort By
        </p>

        <p className="text-sm text-gray-400 mt-1">

          {tempFilters.sort === "default" &&
            "Best Selling"}

          {tempFilters.sort === "az" &&
            "A → Z"}

          {tempFilters.sort === "za" &&
            "Z → A"}

          {tempFilters.sort === "low" &&
            "Price Low → High"}

          {tempFilters.sort === "high" &&
            "Price High → Low"}

        </p>

      </div>

      <FiChevronRight size={22} />

    </button>

  </div>
)}
{/* ===================================== */}
{/* CATEGORY SCREEN */}
{/* ===================================== */}

{screen === "category" && (

  <div className="divide-y">

    {categories.map((category) => (

      <button
        key={category}
        onClick={() =>
          setTempFilters({
            ...tempFilters,
            category,
          })
        }
        className="
          w-full
          px-5
          py-5
          flex
          justify-between
          items-center
          hover:bg-gray-50
          transition
        "
      >

        <span className="text-gray-800">
          {category}
        </span>

        <div
          className={`
            w-5
            h-5
            rounded-full
            border-2
            flex
            items-center
            justify-center
            ${
              tempFilters.category === category
                ? "border-[#1D4F38]"
                : "border-gray-300"
            }
          `}
        >

          {tempFilters.category === category && (

            <div
              className="
                w-2.5
                h-2.5
                rounded-full
                bg-[#1D4F38]
              "
            />

          )}

        </div>

      </button>

    ))}

  </div>

)}

{/* ===================================== */}
{/* AVAILABILITY SCREEN */}
{/* ===================================== */}

{screen === "availability" && (

  <div className="divide-y">

    {[
      {
        label: "All Products",
        value: "all",
      },
      {
        label: "In Stock",
        value: "inStock",
      },
      {
        label: "Out Of Stock",
        value: "outStock",
      },
    ].map((item) => (

      <button
        key={item.value}
        onClick={() =>
          setTempFilters({
            ...tempFilters,
            availability: item.value,
          })
        }
        className="
          w-full
          px-5
          py-5
          flex
          justify-between
          items-center
          hover:bg-gray-50
          transition
        "
      >

        <span className="text-gray-800">

          {item.label}

        </span>

        <div
          className={`
            w-5
            h-5
            rounded-full
            border-2
            flex
            items-center
            justify-center
            ${
              tempFilters.availability === item.value
                ? "border-[#1D4F38]"
                : "border-gray-300"
            }
          `}
        >

          {tempFilters.availability === item.value && (

            <div
              className="
                w-2.5
                h-2.5
                rounded-full
                bg-[#1D4F38]
              "
            />

          )}

        </div>

      </button>

    ))}

  </div>

)}
        </div>

        {/* ===================================== */}
        {/* FOOTER */}
        {/* ===================================== */}

        <div
          className="
            absolute
            bottom-0
            left-0
            w-full
            border-t
            bg-white
            p-4
          "
        >

          <div className="flex gap-3">

            <button
              onClick={clearFilters}
              className="
                w-1/2
                border
                py-3
                rounded-full
                font-medium
              "
            >
              Clear
            </button>

            <button
              onClick={applyFilters}
              className="
                w-1/2
                bg-[#1D4F38]
                text-white
                py-3
                rounded-full
                font-medium
              "
            >
              Apply
            </button>

          </div>

        </div>

      </div>
    </>
  );
};

export default MobileFilter;