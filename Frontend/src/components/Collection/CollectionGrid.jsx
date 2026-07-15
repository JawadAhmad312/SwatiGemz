import { Link } from "react-router-dom";

const CollectionGrid = ({ collections }) => {
  return (
    <div
      className="
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4
        gap-10
        
      "
    >
     {collections.filter(item => item.active).slice(0, 8).map((item) => (
        <Link
          key={item._id}
          to={`/collections/${item.slug}`}
          className="group"
        >
          <div
            className="
  relative
  transition-all
  duration-500
  hover:-translate-y-2
"
          >
            {/* TOP LIGHT EFFECT */}

            <div
              className="
                absolute
                inset-0
                
                opacity-0
                group-hover:opacity-100
                transition
                duration-500
                pointer-events-none
              "
            />

            {/* IMAGE SECTION */}
            <div
              className="
    relative
    flex
    justify-center
    items-center
    pt-2
    px-4
  "
            >
              {/* HEXAGON STYLE USING ROTATION */}

              <div
                className="
      relative
      w-[190px]
      h-[190px]
      flex
      items-center
      justify-center
    "
              >
                {/* OUTER */}

                <div
                  className="
        absolute
        inset-0
        border-[3px]
        border-[#a8a8a8]
        rotate-45
        rounded-[32px]
      "
                />

                {/* INNER */}

                <div
                  className="
        absolute
        inset-[12px]
        border-2
        border-[#d8d8d8]
        rotate-45
        rounded-[24px]
      "
                />

                {/* IMAGE */}

                <div
                  className="
                    absolute
                    inset-0
                    flex
                    items-center
                    justify-center
                  "
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="
      w-[150px]
      h-[150px]
      object-contain
      relative
      z-10
      transition-all
      duration-500
      group-hover:scale-105
      object-cover
    rounded-full
    "
                  />
                </div>
              </div>
            </div>

            {/* CONTENT */}

            <div className="text-center px-4 pb-4 pt-10 md:pt-8">
              <h2
                className="
                  text-[26px]
                  font-bold
                  underline
                  underline-offset-4
                  transition-all
                  duration-300
                  group-hover:text-[#b68b2c]
                "
                style={{
                  fontFamily: '"Playfair Display", serif',
                }}
              >
                {item.name}
              </h2>

              <p
                className="
                  mt-3
leading-7
text-[15px]
py-2
                "
              >
                {item.description}
              </p>

              {/* BUTTON */}

              <div className="md:mt-4">
                <span
                  className="
                    inline-flex
                    items-center
                    justify-center
                    px-6
                    py-2.5
                    rounded-full
                    border
                    border-black
                    text-sm
                    font-semibold
                    tracking-[2px]
                    uppercase
                    transition-all
                    duration-500
                    group-hover:bg-black
                    group-hover:text-white
                  "
                >
                  Explore Collection
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CollectionGrid;