import React, {
  useEffect,
  useState,
  useRef,
} from "react";

import axios from "axios";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import {
  FiTrash2,
} from "react-icons/fi";

function EditGemstone() {

  const { slug } =
    useParams();

  const navigate =
    useNavigate();

  // =========================
  // STATES
  // =========================

  const [collections, setCollections] =
    useState([]);

  const [product, setProduct] =
    useState({});

  const [oldImages, setOldImages] =
    useState([]);

  const [files, setFiles] =
    useState([]);

  const [mainImageFile, setMainImageFile] =
    useState(null);

  const inputRef =
    useRef();

  const mainRef =
    useRef();

  // =========================
  // FETCH COLLECTIONS
  // =========================

  const fetchCollections =
    async () => {

      try {

        const res =
          await axios.get(
            "http://localhost:8080/api/gem-collections"
          );

        setCollections(
          res.data.collections
        );

      } catch (err) {

        console.log(err);
      }
    };

  // =========================
  // FETCH GEMSTONE
  // =========================

  const fetchGemstone =
    async () => {

      try {

        const res =
          await axios.get(
            `http://localhost:8080/api/gemstones/${slug}`
          );

        const gemstone =
          res.data.gemstone;

        setProduct({

          ...gemstone,

          gemCollection:
            gemstone.gemCollection?._id ||
            gemstone.gemCollection,
        });

        setOldImages(
          gemstone.images || []
        );

      } catch (err) {

        console.log(err);
      }
    };

  useEffect(() => {

    fetchCollections();

    fetchGemstone();

  }, []);

  // =========================
  // HANDLE CHANGE
  // =========================

  const handleChange =
    (e) => {

      const {
        name,
        value,
        type,
        checked,
      } = e.target;

      setProduct(prev => ({

        ...prev,

        [name]:

          type === "checkbox"

            ? checked

            : value,
      }));
    };

  // =========================
  // ADD NEW IMAGES
  // =========================

  const handleFiles =
    (e) => {

      setFiles(prev => [

        ...prev,

        ...Array.from(
          e.target.files
        ),
      ]);
    };

  // =========================
  // REMOVE OLD IMAGE
  // =========================

  const removeOldImage =
    (index) => {

      const removed =
        oldImages[index];

      const updated =
        [...oldImages];

      updated.splice(
        index,
        1
      );

      setOldImages(
        updated
      );

      // IF REMOVED MAIN IMAGE

      if (
        removed ===
        product.image
      ) {

        setProduct(prev => ({

          ...prev,

          image: "",
        }));
      }
    };

  // =========================
  // REMOVE NEW IMAGE
  // =========================

  const removeNewImage =
    (index) => {

      const updated =
        [...files];

      updated.splice(
        index,
        1
      );

      setFiles(updated);
    };

  // =========================
  // UPDATE GEMSTONE
  // =========================

  const handleUpdate =
    async () => {

      try {

        const formData =
          new FormData();

        Object.entries(product)
          .forEach(([key, value]) => {

            formData.append(
              key,
              value ?? ""
            );
          });

        // MAIN IMAGE

        if (
          mainImageFile
        ) {

          formData.append(
            "image",
            mainImageFile
          );

        } else {

          formData.append(
            "image",
            product.image || ""
          );
        }

        // OLD IMAGES

        formData.append(

          "existingImages",

          JSON.stringify(
            oldImages
          )
        );

        // NEW IMAGES

        files.forEach(file => {

          formData.append(
            "images",
            file
          );
        });

        const res =
          await axios.put(

            `http://localhost:8080/api/gemstones/${slug}`,

            formData
          );

        alert(
          "Updated Successfully ✅"
        );

        navigate(
          "/admin/dashboard"
        );

      } catch (err) {

        console.log(err);

        alert(
          "Update Failed ❌"
        );
      }
    };

  return (

    <div className="bg-gray-100 min-h-screen p-6">

      <h1 className="text-2xl font-semibold mb-6">
        Edit Gemstone
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT SIDE */}

        <div className="lg:col-span-2 space-y-6">

          {/* PRODUCT INFO */}

          <div className="bg-white p-6 rounded-xl shadow">

            {/* NAME */}

            <label className="block font-medium text-gray-500">
              Product Name
            </label>

            <input
              name="name"
              value={
                product.name || ""
              }
              onChange={
                handleChange
              }
              className="w-full border border-gray-400 p-2 rounded-lg mt-1 outline-none"
            />

            {/* PRODUCT CODE */}

            <label className="block mt-3 font-medium text-gray-500">
              Product Code
            </label>

            <input
              name="productCode"
              value={
                product.productCode || ""
              }
              readOnly
              className="w-full border border-gray-400 p-2 rounded-lg mt-1 bg-gray-100 outline-none"
            />

            {/* SLUG */}

            <label className="block mt-3 font-medium text-gray-500">
              Slug
            </label>

            <input
              name="slug"
              value={
                product.slug || ""
              }
              readOnly
              className="w-full border border-gray-400 p-2 rounded-lg mt-1 bg-gray-100 outline-none"
            />

            {/* COLLECTION */}

            <label className="block mt-3 font-medium text-gray-500">
              Collection
            </label>

            <select
              name="gemCollection"
              value={
                product.gemCollection || ""
              }
              onChange={
                handleChange
              }
              className="w-full border border-gray-400 p-2 rounded-lg mt-1 outline-none"
            >

              <option value="">
                Select Collection
              </option>

              {collections.map(
                item => (

                  <option
                    key={item._id}
                    value={item._id}
                  >
                    {item.name}
                  </option>
                )
              )}

            </select>

            {/* DESCRIPTION */}

            <label className="block mt-3 font-medium text-gray-500">
              Description
            </label>

            <textarea
              name="description"
              value={
                product.description || ""
              }
              onChange={
                handleChange
              }
              rows={5}
              className="w-full border border-gray-400 p-2 rounded-lg mt-1 outline-none"
            />

            {/* SHORT DESCRIPTION */}

            <label className="block mt-3 font-medium text-gray-500">
              Short Description
            </label>

            <textarea
              name="shortDescription"
              value={
                product.shortDescription || ""
              }
              onChange={
                handleChange
              }
              rows={3}
              className="w-full border border-gray-400 p-2 rounded-lg mt-1 outline-none"
            />

          </div>

          {/* MAIN IMAGE */}

          {/* MAIN IMAGE */}

<div className="bg-white p-6 rounded-xl shadow">

  <h2 className="font-semibold mb-3">
    Main Image
  </h2>

  <div className="relative w-fit mx-auto">

    <div
      onClick={() =>
        mainRef.current.click()
      }
      className="
        border-2
        border-dashed
        border-gray-400
        rounded-lg
        p-6
        text-center
        cursor-pointer
      "
    >

      <img
        src={

          mainImageFile

            ? URL.createObjectURL(
                mainImageFile
              )

            : product.image
        }
        className="
          w-28
          h-28
          object-cover
          mx-auto
          rounded
        "
      />

      <input
        type="file"
        ref={mainRef}
        className="hidden"
        onChange={(e) =>
          setMainImageFile(
            e.target.files[0]
          )
        }
      />

    </div>

    {/* DELETE ICON */}

    {(product.image ||
      mainImageFile) && (

      <button

        type="button"

        onClick={() => {

          setMainImageFile(
            null
          );

          setProduct(prev => ({

            ...prev,

            image: "",
          }));
        }}

        className="
          absolute
          top-2
          right-2
          bg-white
          p-1
          rounded-full
          shadow
        "
      >

        <FiTrash2 />

      </button>
    )}

  </div>

  {/* ADD BUTTON */}

  <div className="flex justify-center mt-4">

    <button
      type="button"
      onClick={() =>
        mainRef.current.click()
      }
      className="
        bg-gray-400
        text-white
        px-4
        py-2
        rounded-lg
      "
    >

      Change Main Image

    </button>

  </div>

</div>

          {/* OTHER IMAGES */}

          <div className="bg-white p-6 rounded-xl shadow">

            <h2 className="font-semibold mb-3 text-gray-500">
              Other Images
            </h2>

            {/* OLD IMAGES */}

            <div className="flex flex-wrap gap-3 mb-4">

              {oldImages.map(
                (img, i) => (

                  <div
                    key={i}
                    className="relative"
                  >

                    <img
                      src={img}
                      className="w-20 h-20 object-cover rounded"
                    />

                    <button
                      onClick={() =>
                        removeOldImage(i)
                      }
                      className="absolute top-0 right-0 bg-white p-1 rounded-full shadow"
                    >

                      <FiTrash2 />

                    </button>

                  </div>
                )
              )}

            </div>

            {/* NEW IMAGES */}

            <div className="flex flex-wrap gap-3 mb-4">

              {files.map(
                (file, i) => (

                  <div
                    key={i}
                    className="relative"
                  >

                    <img
                      src={URL.createObjectURL(file)}
                      className="w-20 h-20 object-cover rounded"
                    />

                    <button
                      onClick={() =>
                        removeNewImage(i)
                      }
                      className="absolute top-0 right-0 bg-white p-1 rounded-full shadow"
                    >

                      <FiTrash2 />

                    </button>

                  </div>
                )
              )}

            </div>

            <input
              type="file"
              multiple
              onChange={
                handleFiles
              }
            />

          </div>

        </div>

        {/* RIGHT SIDE */}

        <div className="space-y-6">

          {/* PRICE */}

          <div className="bg-white p-6 rounded-xl shadow">

            <label className="font-semibold text-gray-500">
              Price
            </label>

            <input
              type="number"
              name="price"
              value={
                product.price || ""
              }
              onChange={
                handleChange
              }
              className="w-full border border-gray-400 p-2 rounded-lg outline-none"
            />

          </div>

          {/* STOCK */}

          <div className="bg-white p-6 rounded-xl shadow">

            <label className="font-semibold text-gray-500">
              Stock Quantity
            </label>

            <input
              type="number"
              name="stockquantity"
              value={
                product.stockquantity || ""
              }
              onChange={
                handleChange
              }
              className="w-full border border-gray-400 p-2 rounded-lg outline-none"
            />

          </div>

          {/* DETAILS */}

          <div className="bg-white p-6 rounded-xl shadow">

            {/* WEIGHT */}

            <label className="font-semibold text-gray-500">
              Weight
            </label>

            <input
              type="number"
              name="weight"
              value={
                product.weight || ""
              }
              onChange={
                handleChange
              }
              className="w-full border border-gray-400 p-2 rounded-lg mb-2 outline-none"
            />

            {/* SHAPE */}

            <label className="font-semibold text-gray-500">
              Shape
            </label>

            <input
              name="shape"
              value={
                product.shape || ""
              }
              onChange={
                handleChange
              }
              className="w-full border border-gray-400 p-2 rounded-lg mb-2 outline-none"
            />

            {/* CATEGORY */}

            <label className="font-semibold text-gray-500">
              Category
            </label>

            <input
              name="category"
              value={
                product.category || ""
              }
              onChange={
                handleChange
              }
              className="w-full border border-gray-400 p-2 rounded-lg mb-2 outline-none"
            />

            {/* META TITLE */}

            <label className="font-semibold text-gray-500">
              Meta Title
            </label>

            <input
              name="metaTitle"
              value={
                product.metaTitle || ""
              }
              onChange={
                handleChange
              }
              className="w-full border border-gray-400 p-2 rounded-lg mb-2 outline-none"
            />

            {/* META DESCRIPTION */}

            <label className="font-semibold text-gray-500">
              Meta Description
            </label>

            <textarea
              name="metaDescription"
              value={
                product.metaDescription || ""
              }
              onChange={
                handleChange
              }
              className="w-full border border-gray-400 p-2 rounded-lg mb-2 outline-none"
            />

            {/* FEATURED */}

            <label className="flex gap-2 mt-3 ">

              <input
                type="checkbox"
                name="featured"
                checked={
                  product.featured || false
                }
                onChange={
                  handleChange
                }
              />

              Featured Product

            </label>

            {/* ACTIVE */}

            <label className="flex gap-2 mt-2">

              <input
                type="checkbox"
                name="active"
                checked={
                  product.active || false
                }
                onChange={
                  handleChange
                }
              />

              Active Product

            </label>

          </div>

        </div>

      </div>

      {/* ACTION BUTTONS */}

      <div className="flex justify-end gap-3 mt-6">

        {/* DISCARD */}

        <button
          onClick={() =>
            navigate(
              "/admin/dashboard"
            )
          }
          className="bg-red-500 text-white px-5 py-2 rounded cursor-pointer"
        >

          Discard Changes

        </button>

        {/* UPDATE */}

        <button
          onClick={
            handleUpdate
          }
          className="bg-green-600 text-white px-6 py-2 rounded cursor-pointer"
        >

          Update Gemstone

        </button>

      </div>

    </div>
  );
}

export default EditGemstone;