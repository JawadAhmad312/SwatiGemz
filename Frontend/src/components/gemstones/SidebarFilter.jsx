const SidebarFilter = ({
  availability,
  setAvailability,
  sort,
  setSort,
}) => {

  return (

    <div
      className="
        bg-white
        rounded-xl
        border
        border-gray-200
        p-6
        lg:sticky
        lg:top-10
        h-fit
      "
    >

      {/* Header */}

      <div className="pb-5 border-b border-gray-200">

        <h2
          className="
            text-2xl
            font-bold
            text-black
          "
          style={{
            fontFamily:
              '"Playfair Display", serif',
          }}
        >
          Filters
        </h2>

        <p
          className="
            text-gray-500
            text-sm
            mt-2
            leading-6
          "
        >
          Refine your gemstone collection
          with premium filtering options.
        </p>

      </div>

      {/* Availability */}

      <div className="py-6">

        <div
          className="
            flex
            items-center
            justify-between
            mb-5
          "
        >

          <h3
            className="
              text-lg
              font-semibold
            "
          >
            Availability
          </h3>

          <span className="text-gray-400">
            •
          </span>

        </div>

        <div className="space-y-3">

          {/* All Products */}

          <label
            className={`
              flex
              items-center
              justify-between
              p-3
              rounded-lg
              border
              cursor-pointer
              transition

              ${
                availability === ""
                  ? "border-black bg-gray-50"
                  : "border-gray-200 hover:border-gray-400"
              }
            `}
          >

            <span className="text-sm font-medium">
              All Products
            </span>

            <input
              type="radio"
              checked={availability === ""}
              onChange={() =>
                setAvailability("")
              }
              className="
                w-4
                h-4
                accent-black
              "
            />

          </label>

          {/* In Stock */}

          <label
            className={`
              flex
              items-center
              justify-between
              p-3
              rounded-lg
              border
              cursor-pointer
              transition

              ${
                availability === "in-stock"
                  ? "border-black bg-gray-50"
                  : "border-gray-200 hover:border-gray-400"
              }
            `}
          >

            <span className="text-sm font-medium">
              In Stock
            </span>

            <input
              type="radio"
              checked={
                availability ===
                "in-stock"
              }
              onChange={() =>
                setAvailability(
                  "in-stock"
                )
              }
              className="
                w-4
                h-4
                accent-black
              "
            />

          </label>

          {/* Sold Out */}

          <label
            className={`
              flex
              items-center
              justify-between
              p-3
              rounded-lg
              border
              cursor-pointer
              transition

              ${
                availability === "sold-out"
                  ? "border-black bg-gray-50"
                  : "border-gray-200 hover:border-gray-400"
              }
            `}
          >

            <span className="text-sm font-medium">
              Sold Out
            </span>

            <input
              type="radio"
              checked={
                availability ===
                "sold-out"
              }
              onChange={() =>
                setAvailability(
                  "sold-out"
                )
              }
              className="
                w-4
                h-4
                accent-black
              "
            />

          </label>

        </div>

      </div>

      {/* Sort Section */}

      <div className="pt-6 border-t border-gray-200">

        <h3
          className="
            text-lg
            font-semibold
            mb-4
          "
        >
          Sort By
        </h3>

        <select
          value={sort}
          onChange={(e) =>
            setSort(e.target.value)
          }
          className="
  w-[200px]
  border
  border-gray-300
  rounded-md
  px-2
  py-1
  text-xs
  h-9
  outline-none
  focus:border-black
"
        >

          <option value="">
            Newest
          </option>

          <option value="price-low-high">
            Price ↑
          </option>

          <option value="price-high-low">
            Price ↓
          </option>

          <option value="a-z">
            A → Z
          </option>

          <option value="z-a">
            Z → A
          </option>

        </select>

      </div>

      {/* Reset Button */}

      <button
        onClick={() => {
          setAvailability("");
          setSort("");
        }}
        className="
          w-full
          mt-6
          py-3
          rounded-lg
          border
          border-black
          text-sm
          font-medium
          hover:bg-black
          hover:text-white
          transition
        "
      >
        Clear Filters
      </button>

    </div>

  );
};

export default SidebarFilter;