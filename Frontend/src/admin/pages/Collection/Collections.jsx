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

const Collections = () => {

  const navigate = useNavigate();

  // STATES

  const [collections, setCollections] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("");

  const [collectionPage, setCollectionPage] =
    useState(1);

  const collectionsPerPage = 8;

  // FETCH COLLECTIONS

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {

    try {

      const res = await axios.get(
        "http://localhost:8080/api/gem-collections",
      );

      setCollections(
        res.data.collections
      );

    } catch (err) {

      console.log(err);

    }
  };

  // FILTER COLLECTIONS

  const filteredCollections =
    collections.filter((item) => {

      // SEARCH

      const matchesSearch =
        item.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      // STATUS

      let matchesStatus = true;

      if (statusFilter === "active") {
        matchesStatus =
          item.active === true;
      }

      if (
        statusFilter === "inactive"
      ) {
        matchesStatus =
          item.active === false;
      }

      return (
        matchesSearch &&
        matchesStatus
      );
    });

  // PAGINATION

  const indexOfLastCollection =
    collectionPage *
    collectionsPerPage;

  const indexOfFirstCollection =
    indexOfLastCollection -
    collectionsPerPage;

  const totalCollectionPages =
    Math.ceil(
      filteredCollections.length /
      collectionsPerPage
    );

  // DELETE

  const handleDeleteCollection =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Delete this collection?"
        );

      if (!confirmDelete) return;

      try {

        await axios.delete(
          `http://localhost:8080/api/gem-collections/admin/delete/${id}`
        );

        fetchCollections();

      } catch (err) {

        console.log(err);

      }
    };

  // EDIT

  const handleEditCollection =
    (id) => {

      navigate(
        `/admin/edit-collection/${id}`
      );
    };

  // VIEW

  const handleViewCollection =
    (id) => {

      navigate(
        `/collections/${id}`
      );
    };

  return (

    <div className="bg-white rounded-xl shadow">

      {/* HEADER */}

      <div className="flex flex-wrap p-4 justify-between items-center gap-3 mb-6">

        {/* SEARCH */}

        <input
          type="text"
          placeholder="Search collection..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="border border-gray-400 outline-none px-4 py-2 rounded-lg w-64"
        />

        {/* FILTERS */}

        <div className="flex gap-2 flex-wrap items-center">

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
            className="border rounded-lg border-gray-400 outline-none px-3 py-2"
          >

            <option value="">
              Status
            </option>

            <option value="active">
              Active
            </option>

            <option value="inactive">
              Inactive
            </option>

          </select>

          {/* ADD BUTTON */}

          <button
            onClick={() =>
              navigate(
                "/admin/add-collection"
              )
            }
            className="bg-[#d24a6b] text-white cursor-pointer px-4 py-2 rounded-lg"
          >
            + Add Collection
          </button>

        </div>

      </div>

      {/* TABLE HEADER */}

      <div className="flex justify-between text-gray-600 text-[12px] bg-gray-100 border-b border-gray-300 cursor-pointer font-bold py-2 px-4">

        <div className="w-[35%]">
          COLLECTION
        </div>

        <div className="w-[15%] text-start">
          PRODUCTS
        </div>

        <div className="w-[15%] text-start">
          STATUS
        </div>

        <div className="w-[15%] hidden md:flex text-start">
          CREATED
        </div>

        <div className="w-[20%] text-center">
          ACTIONS
        </div>

      </div>

      {/* DATA */}

      {collections.length === 0 ? (

        <p className="text-center text-gray-400 mt-4">
          No Collections Found
        </p>

      ) : (

        filteredCollections
          .slice(
            indexOfFirstCollection,
            indexOfLastCollection
          )
          .map((item) => {

            const statusText =
              item.active
                ? "Active"
                : "Inactive";

            const statusColor =
              item.active
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-500";

            return (

              <div
                key={item._id}
                className="flex justify-between px-4 items-center border-b border-gray-300 py-4"
              >

                {/* COLLECTION */}

                <div className="flex items-center gap-4 w-[35%]">

                  <img
                    src={item.image}
                    className="w-12 h-12 rounded"
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

                {/* PRODUCTS */}

             {/* PRODUCTS */}

<div className="w-[15%] text-start">

  <span className="
    bg-gray-100
    text-purple-600
    px-3
    py-1
    rounded-md
    text-sm
    font-medium
  ">

    {item.totalProducts || 0}
    {" "}
    Products

  </span>

</div>

                {/* STATUS */}

                <div className="w-[15%] text-start">

                  <span
                    className={`px-3 py-1 rounded-full text-sm ${statusColor}`}
                  >
                    {statusText}
                  </span>

                </div>

                {/* CREATED */}

                <div className="w-[15%] hidden md:flex text-start">

                  {new Date(
                    item.createdAt
                  ).toLocaleDateString()}

                </div>

                {/* ACTIONS */}

                <div className="w-[20%] flex justify-center gap-2">   

                  {/* EDIT */}

                  <button
                    onClick={() =>
                      handleEditCollection(
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
                    <FiEdit className="text-blue-600"/>
                  </button>

                  {/* DELETE */}

                  <button
                    onClick={() =>
                      handleDeleteCollection(
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
                    <FiTrash2  className="text-red-600"/>
                  </button>

                </div>

              </div>
            );
          })
      )}

      {/* PAGINATION */}

      {collections.length > 0 && (

        <div className="flex justify-between items-center mt-4 p-4">

          <p className="text-sm text-gray-400">

            Showing
            {" "}
            {indexOfFirstCollection + 1}
            {" "}to{" "}
            {Math.min(
              indexOfLastCollection,
              filteredCollections.length
            )}
            {" "}of{" "}
            {filteredCollections.length}
            {" "}collections

          </p>

          <div className="flex gap-2">

            {/* PREV */}

            <button
              onClick={() =>
                setCollectionPage(
                  collectionPage - 1
                )
              }
              disabled={
                collectionPage === 1
              }
              className="border px-3 py-1 rounded disabled:opacity-50"
            >
              ‹
            </button>

            {/* PAGE NUMBERS */}

            {[...Array(
              totalCollectionPages
            )].map((_, i) => (

              <button
                key={i}
                onClick={() =>
                  setCollectionPage(
                    i + 1
                  )
                }
                className={`px-3 py-1 rounded ${
                  collectionPage ===
                  i + 1
                    ? "bg-blue-500 text-white"
                    : "border"
                }`}
              >
                {i + 1}
              </button>
            ))}

            {/* NEXT */}

            <button
              onClick={() =>
                setCollectionPage(
                  collectionPage + 1
                )
              }
              disabled={
                collectionPage ===
                totalCollectionPages
              }
              className="border px-3 py-1 rounded disabled:opacity-50"
            >
              ›
            </button>

          </div>

        </div>
      )}

    </div>
  );
};

export default Collections;