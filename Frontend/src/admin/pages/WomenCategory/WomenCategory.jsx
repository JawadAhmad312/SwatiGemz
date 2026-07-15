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

const WomenCategory = () => {

  const navigate =
    useNavigate();

  /* STATES */

  const [categories, setCategories] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("");

  const [priceFilter, setPriceFilter] =
    useState("");

  const [page, setPage] =
    useState(1);

  const perPage = 8;

  /* FETCH */

  useEffect(() => {

    fetchCategories();

  }, []);

  const fetchCategories =
    async () => {

      try {

        const res =
          await axios.get(
            "http://localhost:8080/api/women"
          );

        setCategories(

          res.data ||

          res.data.products ||

          []
        );

      } catch (err) {

        console.log(err);

        setCategories([]);
      }
    };

  /* DELETE */

  const handleDelete =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Delete this category?"
        );

      if (!confirmDelete)
        return;

      try {

        await axios.delete(

          `http://localhost:8080/api/women/${id}`
        );

        fetchCategories();

      } catch (err) {

        console.log(err);
      }
    };

  /* FILTERS */

  const filteredCategories =

    (categories || []).filter(
      (item) => {

        const matchesSearch =

          item.title
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            );

        let matchesStatus = true;

        const stockquantity =
          item.stockquantity || 0;

        if (statusFilter === "in") {

          matchesStatus =
            stockquantity >= 10;
        }

        if (statusFilter === "low") {

          matchesStatus =
            stockquantity > 0 &&
            stockquantity < 10;
        }

        if (statusFilter === "out") {

          matchesStatus =
            stockquantity === 0;
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

          matchesStatus &&

          matchesPrice
        );
      }
    );

  /* PAGINATION */

  const indexOfLastItem =
    page * perPage;

  const indexOfFirstItem =
    indexOfLastItem - perPage;

  const currentItems =
    filteredCategories.slice(

      indexOfFirstItem,

      indexOfLastItem
    );

  const totalPages =
    Math.ceil(
      filteredCategories.length /
      perPage
    );

  return (

    <div className="
      bg-white
      rounded-xl
      shadow
    ">

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
          placeholder="Search category..."
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

          <p className="
            text-gray-500
            font-bold
          ">

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
              border-gray-400
              outline-none
              px-3
              py-2
              rounded-lg
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

            <option value="10000-50000">
              10k - 50k
            </option>

          </select>

          {/* ADD */}

          <button
            onClick={() =>
              navigate(
                "/admin/addwomencategory"
              )
            }
            className="
col-span-2
md:col-span-1
bg-[#d24a6b]
text-white
px-4
py-2
rounded-lg
"
          >

            + Add Category

          </button>

        </div>

      </div>

      {/* HEADER */}

     <div className="
hidden md:flex
justify-between
        text-gray-600
        text-[12px]
        bg-gray-100
        border-b
        border-gray-300
        font-bold
        py-2
        px-4
      ">

        <div className="w-[35%]">
          PRODUCT
        </div>

        <div className="w-[10%]">
          STOCK
        </div>

        <div className="w-[10%]">
          PRICE
        </div>

        <div className="w-[10%]">
          PRODUCT CODE
        </div>

        <div className="w-[10%]">
          STATUS
        </div>

        <div className="w-[10%]">
          CREATED
        </div>

        <div className="
          w-[15%]
          text-center
        ">
          ACTIONS
        </div>

      </div>

      {/* DATA */}

      {filteredCategories.length === 0 ? (

        <p className="
          text-center
          text-gray-400
          mt-4
        ">

          No Women Categories Found

        </p>

      ) : (

        currentItems.map(
          (item) => {

            const stockquantity =
              item.stockquantity || 0;

            let statusText =
              "Published";

            let statusColor =
              "bg-green-100 text-green-600";

            if (stockquantity === 0) {

              statusText =
                "Out of Stock";

              statusColor =
                "bg-red-100 text-red-500";
            }

            else if (
              stockquantity < 10
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
                 w-full md:w-[35%]
                ">

                  <img
                    src={item.mainimages}
                    className="
                      w-14
                      h-14
                      rounded-lg
                      object-cover
                    "
                  />

                  <div>

                    <p className="
                      text-[14px]
                      font-medium
                    ">

                      {item.title}

                    </p>

                    <small className="
                      text-gray-400
                    ">

                      Women Category

                    </small>

                  </div>

                </div>

                {/* STOCK */}

              <div className="w-full md:w-[10%]">

<span className="md:hidden font-semibold">
Stock:
</span>{" "}

{stockquantity}

</div>

                {/* PRICE */}

               <div className="w-full md:w-[10%]">

<span className="md:hidden font-semibold">
Price:
</span>{" "}

PKR {Number(item.price).toLocaleString()}

</div>

                {/* PRODUCT CODE */}

               <div className="w-full md:w-[10%]">

<span className="md:hidden font-semibold">
Product Code:
</span>{" "}

{item.details?.productCode}

</div>

                {/* STATUS */}
<div className="w-full md:w-[10%]">
                  <span
                    className={`
                      px-3
                      py-1
                      rounded
                      text-xs
                      ${statusColor}
                    `}
                  >

                    {statusText}

                  </span>

                </div>

                {/* DATE */}

               <div className="
w-full
md:w-[10%]
text-sm
text-gray-500
">

               createdAt : {
                    new Date(
                      item.createdAt
                    ).toLocaleDateString()
                  }

                </div>

                {/* ACTIONS */}

                <div className="
w-full
md:w-[15%]
flex
md:justify-center
gap-2
">

                  {/* EDIT */}

                  <button
                    onClick={() =>
                      navigate(

                        `/admin/editwomencategory/${item._id}`
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

                    <FiEdit className="
                      text-blue-600
                    " />

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

                    <FiTrash2 className="
                      text-red-600
                    " />

                  </button>

                </div>

              </div>
            );
          }
        )
      )}

      {/* PAGINATION */}

      {filteredCategories.length > 0 && (

        <div className="
          flex
          justify-between
          items-center
          mt-4
          px-4
          pb-4
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

              filteredCategories.length
            )}

            {" "}of{" "}

            {filteredCategories.length}

            {" "}categories

          </p>

          <div className="flex gap-2">

            {/* PREV */}

            <button
              onClick={() =>
                setPage(page - 1)
              }
              disabled={page === 1}
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

            {/* PAGE */}

            {[...Array(totalPages)]
              .map((_, i) => (

                <button
                  key={i}
                  onClick={() =>
                    setPage(i + 1)
                  }
                  className={`
                    px-3
                    py-1
                    rounded

                    ${page === i + 1

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
                setPage(page + 1)
              }
              disabled={
                page === totalPages
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

export default WomenCategory;