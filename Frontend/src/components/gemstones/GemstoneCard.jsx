import { Link } from "react-router-dom";

const GemstoneCard = ({ item }) => {

  return (
    <Link
      to={`/product/gemstone/${item.slug}`}
      state={{ item }}
      className="group block"
    >

      <div
        className="
 w-full
  border
  border-gray-200
  rounded-md
  bg-[#f7f7f7]
  overflow-hidden
  transition-all
  duration-300
"
      >

        {/* IMAGE SECTION */}

        <div
          className="
            relative
            flex
            items-center
            justify-center
            h-[220px]
            md:h-[260px]
            bg-[#f7f7f7]
            overflow-hidden
          "
        >

          {/* SOLD OUT */}

          {item.soldOut && (
            <span
              className="
                absolute
                left-5
                bottom-5
                bg-red-600
                text-white
                md:text-sm
                md:px-5
                md:py-2
                text-[10px]
px-3
py-1
                rounded-full
                z-20
              "
            >
              Sold out
            </span>
          )}

          {/* CIRCLE BG */}

          <div
            className="
              absolute
              w-[140px]
              h-[140px]
              md:w-[180px]
              md:h-[180px]
              rounded-full
              bg-[#fbfbfb]
            "
          />

          {/* IMAGE */}

          <img
            src={
              item.image ||
              item.images?.[0]
            }
            alt={item.name}
            className="
              relative
              z-10
              w-[140px]
              h-[140px]
              md:w-[180px]
              md:h-[180px]
              object-contain
              transition-transform
              duration-500
              rounded-full
              group-hover:scale-105
            "
          />

        </div>

        {/* CONTENT */}

        <div className="px-2 md:px-4 py-3">

          {/* NAME */}

          <div className="flex items-center gap-1 mt-2">

  <h3
    className="
      text-[16px]
      md:text-[18px]
      font-semibold
      text-black
      truncate
      max-w-[75%]
    "
    style={{
      fontFamily: '"Playfair Display", serif',
    }}
  >
    {item.name
      ?.replace("-", "")
      ?.split(" ")
      ?.slice(0, 2)
      ?.join(" ")}
  </h3>
-
  <span
    className="
      text-[15px]
      md:text-[18px]
      text-black
      font-semibold
      whitespace-nowrap
    "
    style={{
      fontFamily: '"Playfair Display", serif',
    }}
  >
    {item.weight} crt
  </span>

</div>

          {/* PRICE */}

          <div className="mt-4">

            <p
              className="
    text-[11px]
    md:text-[15px]
    text-black
    "
            >
              Rs.
              {new Intl.NumberFormat(
                "en-PK"
              ).format(item.price)}
              .00 PKR
            </p>

          </div>

        </div>

      </div>

    </Link>
  );
};

export default GemstoneCard;