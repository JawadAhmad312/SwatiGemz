const SortBar = ({
  sort,
  setSort,
  totalProducts,
}) => {

  return (

    <div
      className="
        flex
        flex-col
        md:flex-row
        md:items-center
        md:justify-between
        gap-4
        mb-8
        pb-5
        border-b
        border-gray-200
      "
    >

      {/* LEFT SIDE */}

      <div>

        <h2
          className="
            text-xl
            sm:text-2xl
            md:text-4xl
            font-bold
            text-black
          "
          style={{
            fontFamily:
              '"Playfair Display", serif',
          }}
        >
          Gemstone Collection
        </h2>

        <p
          className="
            text-gray-500
            mt-1
            text-sm
          "
        >
          {totalProducts} Products
        </p>

      </div>

      {/* RIGHT SIDE */}

      <div
        className="
          flex
          items-center
          justify-between
          md:justify-end
          gap-3
          w-full
          md:w-auto
        "
      >

        <span
          className="
            text-sm
            font-medium
            text-gray-600
          "
        >
          Sort By
        </span>

        <div className="relative">

          <select
            value={sort}
            onChange={(e) =>
              setSort(e.target.value)
            }
            className="
              appearance-none
              bg-gray-100
              border
              border-gray-200
              rounded-full
              px-4
              py-2
              pr-8
              text-sm
              font-medium
              text-gray-700
              cursor-pointer
              outline-none
              hover:border-gray-400
              focus:border-black
              focus:bg-white
              transition
              min-w-[110px]
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

          <span
            className="
              absolute
              right-3
              top-1/2
              -translate-y-1/2
              text-[11px]
              text-gray-500
              pointer-events-none
            "
          >
            ▼
          </span>

        </div>

      </div>

    </div>

  );
};

export default SortBar;