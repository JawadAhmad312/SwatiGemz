import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiTrash2 } from "react-icons/fi";


function AddStone() {

  const navigate = useNavigate();

  const [stone, setStone] = useState({
    name: "",
    price: "",
    category: "",
    weight: "",
    shape: "",
    stockquantity: "",
    description: ""
  });

  const [mainImage, setMainImage] = useState(null);
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const inputRef = useRef();
  const mainRef = useRef();

  // HANDLE CHANGE
  const handleChange = (e) => {
    setStone({
      ...stone,
      [e.target.name]: e.target.value
    });
  };

  // HANDLE FILES
  const handleFiles = (selectedFiles) => {
    setFiles(prev => [...prev, ...Array.from(selectedFiles)]);
  };

  const removeFile = (index) => {
    const updated = [...files];
    updated.splice(index, 1);
    setFiles(updated);
  };

  // ✅ VALIDATION (IMPROVED)
  const validate = () => {
    let err = {};

    if (!stone.name.trim()) err.name = "Name required";
    if (!stone.price || Number(stone.price) <= 0) err.price = "Valid price required";
    if (!stone.weight || Number(stone.weight) <= 0) err.weight = "Valid weight required";
    if (!stone.shape.trim()) err.shape = "Shape required";
    if (!stone.category.trim()) err.category = "Category required";
    if (!stone.stockquantity || Number(stone.stockquantity) < 0)
      err.stockquantity = "Valid stock required";
    if (!mainImage) err.image = "Main image required";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    const formData = new FormData();

    Object.entries(stone).forEach(([key, value]) => {
      formData.append(key, value ?? "");
    });

    formData.append("image", mainImage);
    files.forEach(file => formData.append("images", file));

    try {
      const res = await fetch("http://localhost:8080/api/stone", {
        method: "POST",
        body: formData,
        credentials: "include"
      });

      const data = await res.json();

      if (data.success) {
        alert("Stone Added Successfully ✅");

        // RESET
        setStone({
          name: "",
          price: "",
          category: "",
          weight: "",
          shape: "",
          stockquantity: "",
          description: ""
        });

        setMainImage(null);
        setFiles([]);
        setErrors({});

        if (inputRef.current) inputRef.current.value = "";
        if (mainRef.current) mainRef.current.value = "";

        navigate("/admin/dashboard");
      }

    } catch (err) {
      console.error(err);
      alert("Error ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">

      <h1 className="text-2xl font-semibold mb-6">Add Stone</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">

          {/* PRODUCT INFO */}
          <div className="bg-white p-6 rounded-xl shadow">

            <h2 className="text-lg font-semibold mb-2">Product Information</h2>

            <input
              name="name"
              placeholder="Stone Name"
              value={stone.name}
              onChange={handleChange}
              className="w-full border p-2 border-gray-400 rounded-md outline-none mb-2"
            />
            <p className="text-red-500 text-sm">{errors.name}</p>

            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <textarea
              name="description"
              placeholder="Description"
              value={stone.description}
              onChange={handleChange}
              rows={4}
              className="w-full border p-2 border-gray-400 rounded-md outline-none"
            />

          </div>

          {/* MAIN IMAGE */}
          {/* MAIN IMAGE */}

<div className="bg-white p-6 rounded-xl shadow">

  <h2 className="font-semibold mb-3">

    Main Image

  </h2>

  <div className="flex items-center gap-4 flex-wrap">

    {/* IMAGE PREVIEW */}

    {mainImage && (

      <div className="relative w-fit">

        <img
          src={URL.createObjectURL(mainImage)}

          className="
            w-28
            h-28
            object-cover
            rounded-lg
            border
          "
        />

        {/* DELETE ICON */}

        <button
          type="button"

          onClick={() =>
            setMainImage(null)
          }

          className="
            absolute
            -top-2
            -right-2
            bg-white
            rounded-full
            p-1
            shadow-md
            border
            border-gray-200
            hover:bg-red-50
            transition
          "
        >

      <FiTrash2
       className="
         text-red-500
         text-sm
       "
     />

        </button>

      </div>
    )}

    {/* ADD BUTTON */}

    {!mainImage && (

      <button
        type="button"

        onClick={() =>
          mainRef.current.click()
        }

        className="
          h-10
          px-4
          bg-gray-200
          rounded
          text-sm
          text-gray-700
        "
      >

        Browse Main Image

      </button>
    )}

    <input
      type="file"

      ref={mainRef}

      className="hidden"

      onChange={(e) => {

        if (
          e.target.files[0]
        ) {

          setMainImage(
            e.target.files[0]
          );
        }
      }}
    />

  </div>

  <p className="text-red-500 text-sm mt-2">

    {errors.image}

  </p>

</div>

          {/* OTHER IMAGES */}
     {/* OTHER IMAGES */}

<div className="bg-white p-6 rounded-xl shadow">

  <h2 className="font-semibold mb-3">

    Other Images

  </h2>

  {/* IMAGE PREVIEW */}

  <div className="flex flex-wrap gap-3 mb-4">

    {files.map((file, i) => (

      <div
        key={i}
        className="relative"
      >

        <img
          src={URL.createObjectURL(file)}

          className="
            w-20
            h-20
            object-cover
            rounded-lg
            border
          "
        />

        {/* DELETE ICON */}

        <button
          type="button"

          onClick={() =>
            removeFile(i)
          }

          className="
            absolute
            -top-2
            -right-2
            bg-white
            rounded-full
            p-1
            shadow-md
            border
            border-gray-200
            hover:bg-red-50
            transition
          "
        >

         <FiTrash2
          className="
            text-red-500
            text-sm
          "
        />

        </button>

      </div>
    ))}

  </div>

  {/* ADD BUTTON */}

  <div className="flex justify-center">

    <button
      type="button"

      onClick={() =>
        inputRef.current.click()
      }

      className="
        h-8
        px-3
        text-xs
        bg-gray-200
        rounded
        text-gray-700
      "
    >

      Browse Other Images

    </button>

    <input
      type="file"

      multiple

      ref={inputRef}

      className="hidden"

      onChange={(e) =>
        handleFiles(
          e.target.files
        )
      }
    />

  </div>

</div>

        </div>

        {/* RIGHT */}
        <div className="space-y-6">

          {/* PRICE */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="font-semibold">Pricing</h2>

            <input
              type="number"
              name="price"
              placeholder="Price"
              value={stone.price}
              onChange={handleChange}
              className="w-full border p-2 border-gray-400  rounded-md outline-none"
            />
            <p className="text-red-500 text-sm">{errors.price}</p>
          </div>

          {/* DETAILS */}
          <div className="bg-white p-6 rounded-xl shadow">

            <h2 className="font-semibold">Details</h2>

            <input
              name="category"
              placeholder="Category"
              value={stone.category}
              onChange={handleChange}
              className="w-full border p-2 border-gray-400 rounded-md outline-none mb-2"
            />
            <p className="text-red-500 text-sm">{errors.category}</p>

            <input
              name="weight"
              placeholder="Weight"
              value={stone.weight}
              onChange={handleChange}
              className="w-full border p-2 border-gray-400 rounded-md outline-none mb-2"
            />
            <p className="text-red-500 text-sm">{errors.weight}</p>

            <input
              name="shape"
              placeholder="Shape"
              value={stone.shape}
              onChange={handleChange}
              className="w-full border p-2 border-gray-400 rounded-md outline-none mb-2"
            />
            <p className="text-red-500 text-sm">{errors.shape}</p>

            <input
              type="number"
              name="stockquantity"
              placeholder="Stock Quantity"
              value={stone.stockquantity}
              onChange={handleChange}
              className="w-full border p-2 border-gray-400 rounded-md outline-none"
            />
            <p className="text-red-500 text-sm">{errors.stockquantity}</p>

          </div>

        </div>

      </form>

      {/* ACTIONS */}
      <div className="flex justify-end gap-3 mt-6">

        <button
          type="button"
          onClick={() => navigate("/admin/dashboard")}
          className="bg-red-400 text-white px-5 py-2 rounded"
        >
          Cancel
        </button>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-green-600 text-white px-6 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Publishing..." : "Publish"}
        </button>

      </div>

    </div>
  );
}

export default AddStone;


   
