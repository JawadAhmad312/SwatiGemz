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

  const MenCategory = () => {

    const navigate =
      useNavigate();

    // STATES

    const [mencategory, setMencategory] =
      useState([]);

    const [search, setSearch] =
      useState("");

    const [statusFilter, setStatusFilter] =
      useState("");

    const [priceFilter, setPriceFilter] =
      useState("");

    const [menPage, setMenPage] =
      useState(1);

    const menPerPage = 8;

    // FETCH DATA

    useEffect(() => {

      fetchMencategory();

    }, []);

    const fetchMencategory =
      async () => {

        try {

          const res =
            await axios.get(
              "http://localhost:8080/api/men"
            );

          setMencategory(

            res.data ||

            []
          );

        } catch (err) {

          console.log(err);

          setMencategory([]);
        }
      };

    // DELETE

    const handleDeleteMen =
      async (id) => {

        const confirmDelete =
          window.confirm(
            "Delete this men category?"
          );

        if (!confirmDelete)
          return;

        try {

          await axios.delete(
            `http://localhost:8080/api/men/${id}`
          );

          fetchMencategory();

        } catch (err) {

          console.log(err);

        }
      };

    // FILTERS

    const filteredMenCategory =
      (mencategory || []).filter(
        (item) => {

          const matchesSearch =
            item.title
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              );

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

            matchesStatus &&

            matchesPrice
          );
        }
      );

    // PAGINATION

    const indexOfLastItem =
      menPage *
      menPerPage;

    const indexOfFirstItem =
      indexOfLastItem -
      menPerPage;

    const currentMenCategory =
      filteredMenCategory.slice(

        indexOfFirstItem,

        indexOfLastItem
      );

    const totalPages =
      Math.ceil(
        filteredMenCategory.length /
        menPerPage
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

            <p className="text-gray-500 font-bold">
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

              <option value="10000-20000">
                10k - 20k
              </option>

            </select>

            {/* ADD BUTTON */}

            <button
              onClick={() =>
                navigate(
                  "/admin/dashboard/addmencategory"
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

        {/* TABLE HEADER */}

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

          <div className="w-[30%]">
            PRODUCT
          </div>

          <div className="w-[10%]">
            STOCK
          </div>

          <div className="w-[10%]">
            PRICE
          </div>

          <div className="w-[10%]">
            ORDERS
          </div>

          <div className="w-[10%]">
            RATING
          </div>

          <div className="w-[10%]">
            STATUS
          </div>

          <div className="w-[10%] text-center">
            ACTIONS
          </div>

        </div>

        {/* DATA */}

        {filteredMenCategory.length === 0 ? (

          <p className="
            text-center
            text-gray-400
            mt-4
          ">

            No Men Categories Found

          </p>

        ) : (

          currentMenCategory.map(
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
border-gray-400
py-4
gap-3
"
>

                  {/* PRODUCT */}

                  <div className="
                    flex
                    items-center
                    gap-4
                   w-full md:w-[30%]
                  ">

                    <img
                      src={item.mainimages}
                      className="
                        w-12
                        h-12
                        rounded
                        object-cover
                      "
                    />

                    <div>

                      <p className="text-[14px]">
                        {item.title}
                      </p>

                      <small className="text-gray-400">
                        By Admin
                      </small>

                    </div>

                  </div>

                  {/* STOCK */}

                  <div className="w-full md:w-[10%]">

<span className="md:hidden font-semibold">
Stock:
</span>{" "}

{stock}

</div>

                  {/* PRICE */}

                 <div className="w-full md:w-[10%]">

<span className="md:hidden font-semibold">
Price:
</span>{" "}

PKR {Number(item.price).toLocaleString()}

</div>

                  {/* ORDERS */}

                  <div className="w-full md:w-[10%]">

<span className="md:hidden font-semibold">
Orders:
</span>{" "}

{item.orders || 0}

</div>

            

                  {/* STATUS */}

                 <div className="w-full md:w-[10%]">

                    <span
                      className={`
                        px-3
                        py-1
                        rounded
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
                        navigate(
                          `/admin/dashboard/editmencategory/${item._id}`
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
                        handleDeleteMen(
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

        {filteredMenCategory.length > 0 && (

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

                filteredMenCategory.length
              )}

              {" "}of{" "}

              {filteredMenCategory.length}

              {" "}products

            </p>

            <div className="flex gap-2">

              {/* PREV */}

              <button
                onClick={() =>
                  setMenPage(
                    menPage - 1
                  )
                }
                disabled={
                  menPage === 1
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
                      setMenPage(
                        i + 1
                      )
                    }
                    className={`
                      px-3
                      py-1
                      rounded

                      ${menPage ===
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
                  setMenPage(
                    menPage + 1
                  )
                }
                disabled={
                  menPage ===
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

  export default MenCategory;