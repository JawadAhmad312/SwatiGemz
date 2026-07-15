import { Link } from "react-router-dom";

const CollectionCard = ({ item }) => {

  return (
    <Link
      to={`/collections/${item.slug}`}
      className="group"
    >

      <div className="text-center">

        {/* IMAGE */}

        <div
          className="
          w-[220px]
          h-[220px]
          mx-auto
          rounded-full
          bg-white
          shadow-[0_10px_40px_rgba(0,0,0,0.08)]
          flex
          items-center
          justify-center
          overflow-hidden
          transition
          duration-500
          group-hover:scale-105
        "
        >

          <img
            src={item.image}
            alt={item.name}
            className="
              w-[150px]
              h-[150px]
              object-contain
              transition
              duration-500
              group-hover:scale-110
            "
          />
        </div>

        {/* NAME */}

        <h2
          className="
            mt-7
            text-2xl
            font-semibold
            underline
            underline-offset-4
          "
        >
          {item.name}
        </h2>

        {/* DESCRIPTION */}

        <p
          className="
            mt-4
            text-gray-600
            leading-7
            max-w-[260px]
            mx-auto
          "
        >
          {item.description}
        </p>
      </div>
    </Link>
  );
};

export default CollectionCard;