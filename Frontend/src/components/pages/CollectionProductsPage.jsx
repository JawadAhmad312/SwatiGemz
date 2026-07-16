import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

import SidebarFilter from "../gemstones/SidebarFilter";
import GemstoneCard from "../gemstones/GemstoneCard";
import SortBar from "../gemstones/SortBar";
import ProductPagination from "../common/ProductPagination";

const CollectionProductsPage = () => {

  const { slug } = useParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [availability, setAvailability] =
    useState("");

  const [sort, setSort] =
    useState("");

  const [showFilters, setShowFilters] =
    useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    setCurrentPage(1);
    fetchProducts();
  }, [slug, availability, sort]);

  const fetchProducts = async () => {

    try {

      setLoading(true);

      const res = await axios.get(
        `http://localhost:8080/api/gemstones/collection/${slug}`,
        {
          params: {
            availability,
            sort,
          },
        }
      );

      setProducts(
        res.data.gemstones || []
      );

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }
  };

  const currentProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return products.slice(start, start + itemsPerPage);
  }, [products, currentPage]);

  const totalPages = Math.ceil(products.length / itemsPerPage);

  if (loading) {
    return (
      <div className="py-32 text-center">
        Loading...
      </div>
    );
  }

  return (
    <>
      <section
        className="
          min-h-screen
          py-4
          md:py-16
          px-4
        "
      >

        <div
          className="
            max-w-7xl
            mx-auto
            grid
            grid-cols-1
            lg:grid-cols-[280px_1fr]
            gap-10
          "
        >

          {/* Desktop Sidebar */}

          <div className="hidden lg:block">

            <SidebarFilter
              availability={availability}
              setAvailability={
                setAvailability
              }
              sort={sort}
              setSort={setSort}
            />

          </div>

          {/* Products Section */}

          <div>

            {/* Mobile Filter Button */}

        <div
  onClick={() =>
    setShowFilters(true)
  }
  className="
    lg:hidden
    flex
    justify-between
    items-center
    py-4
    border-b
    border-gray-200
    mb-4
    cursor-pointer
  "
>

  <span
    className="
      text-sm
      font-medium
      flex
      items-center
      gap-2
    "
  >
    ⚙ Filter & Sort
  </span>

  <span
    className="
      text-sm
      text-gray-500
    "
  >
    {products.length} Products
  </span>

</div>

            {/* Sort Bar */}

           <div className="hidden lg:block">

  <SortBar
    sort={sort}
    setSort={setSort}
    totalProducts={products.length}
  />

</div>

            {/* Collection Heading */}

            <div
              className="
                flex
                justify-between
                items-center
                mb-10
              "
            >

              <div>

                <h1
                  className="
                    text-4xl
                    font-bold
                    capitalize
                  "
                >
                  {slug.replace("-", " ")}
                </h1>

                <p
                  className="
                    mt-3
                    text-gray-600
                  "
                >
                  Premium natural gemstone
                  collection.
                </p>

              </div>

              

            </div>

            {/* Products Grid */}

            <div
  className="
    grid
    grid-cols-2
    md:grid-cols-3
    xl:grid-cols-4
    gap-3
  "
>

              {currentProducts.map((item) => (

                <GemstoneCard
                  key={item._id}
                  item={item}
                />

              ))}

            </div>

          </div>

          <ProductPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />

        </div>

      </section>

      {/* Mobile Filter Drawer */}

      {showFilters && (

        <div
          className="
            fixed
            inset-0
            bg-black/50
            z-50
          "
        >

          <div
            className="
              absolute
              left-0
              top-0
              h-full
              w-[85%]
max-w-[340px]
              bg-white
              overflow-y-auto
            "
          >

            <div
              className="
                flex
                justify-between
                items-center
                p-4
                border-b
              "
            >

              <div className="text-center flex-1">

  <h2 className="font-semibold">
    Filter and Sort
  </h2>

  <p className="text-xs text-gray-500">
    {products.length} Products
  </p>

</div>
              <button
                onClick={() =>
                  setShowFilters(false)
                }
                className="
                  text-2xl
                  font-bold
                "
              >
                ×
              </button>

            </div>

            <SidebarFilter
              availability={availability}
              setAvailability={
                setAvailability
              }
              sort={sort}
              setSort={setSort}
            />

          </div>

        </div>

      )}
    </>
  );
};

export default CollectionProductsPage;
