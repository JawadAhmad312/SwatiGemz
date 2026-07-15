import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiTrash2 } from "react-icons/fi";


function AddEarring() {

  const [earring, setEarring] = useState({
    name: "",
    price: "",
    currency: "PKR",
    description: "",
    metal: "925 Silver",
    stoneWeight: "",
    category: "Earrings",
    stockquantity: "",
    availability: "",
    isActive: true
  });

  const [mainImage, setMainImage] = useState(null);
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const inputRef = useRef();
  const mainRef = useRef();
const [loading, setLoading] = useState(false); 


  // HANDLE INPUT
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setEarring(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  // FILE HANDLING
  const handleFiles = (selectedFiles) => {
    setFiles(prev => [...prev, ...Array.from(selectedFiles)]);
  };

  const removeFile = (index) => {
    const updated = [...files];
    updated.splice(index, 1);
    setFiles(updated);
  };

  // VALIDATION
  const validate = () => {
    let err = {};

    if (!earring.name) err.name = "Name required";
    if (!earring.price || earring.price <= 0) err.price = "Valid price required";
    if (!earring.description) err.description = "Description required";
    if (!earring.stockquantity) err.stockquantity = "Stock required";
    if (!earring.stoneWeight) err.stoneWeight = "Stone weight required";
    if (!mainImage) err.image = "Main image required";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
setLoading(true);
    if (!mainImage) {

    alert(
      "Please select main image"
    );

    return;
  }

  if (!validate()) return;

    const formData = new FormData();

    Object.entries(earring).forEach(([key, value]) => {
      formData.append(key, value ?? "");
    });

    formData.append("image", mainImage);
    files.forEach(file => formData.append("images", file));

    try {
      const res = await fetch("http://localhost:8080/api/earrings", {
        method: "POST",
        body: formData,
        credentials: "include"
      });

      const data = await res.json();

      if (data.success) {
        alert("Earring Added Successfully ✅");

        // ✅ RESET FORM
        setEarring({
          name: "",
          price: "",
          currency: "PKR",
          description: "",
          metal: "925 Silver",
          stoneWeight: "",
          category: "Earrings",
          stockquantity: "",
          availability: "",
          isActive: true
        });

        setMainImage(null);
        setFiles([]);
        setErrors({});

        // clear file inputs
        if (inputRef.current) inputRef.current.value = "";
        if (mainRef.current) mainRef.current.value = "";

        // ✅ NAVIGATE TO DASHBOARD
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

      <h1 className="text-2xl font-semibold mb-6">Add Earring</h1>

      < form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">

          {/* PRODUCT INFO */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-2">Product Information</h2>

            <input
              name="name"
              placeholder="Product Name"
              value={earring.name}
              onChange={handleChange}
              className="w-full border border-gray-400 p-2 rounded-md outline-none mb-2"
            />
            <p className="text-red-500 text-sm">{errors.name}</p>

            <textarea
              name="description"
              placeholder="Description"
              value={earring.description}
              onChange={handleChange}
              rows={5}
              className="w-full border border-gray-400 p-2 rounded-md outline-none"
            />
            <p className="text-red-500 text-sm">{errors.description}</p>
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

      <div className="relative">

        <img
          src={URL.createObjectURL(mainImage)}

          className="
            w-24
            h-24
            object-cover
            rounded
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
                   text-md
                 "
               />
        </button>

      </div>
    )}

    {/* BUTTON */}

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
            rounded
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

  {/* BUTTON */}

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
            <h2 className="text-lg font-semibold">Pricing</h2>

            <input
              type="number"
              name="price"
              placeholder="Price"
              value={earring.price}
              onChange={handleChange}
              className="w-full border border-gray-400 p-2 rounded-md outline-none"
            />
            <p className="text-red-500 text-sm">{errors.price}</p>
          </div>

          {/* STOCK */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold">Inventory</h2>

            <input
              type="number"
              name="stockquantity"
              placeholder="Stock Quantity"
              value={earring.stockquantity}
              onChange={handleChange}
              className="w-full border border-gray-400 p-2 rounded-md outline-none"
            />
            <p className="text-red-500 text-sm">{errors.stockquantity}</p>
          </div>

          {/* DETAILS */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold">Details</h2>

            <input
              name="stoneWeight"
              placeholder="Stone Weight"
              value={earring.stoneWeight}
              onChange={handleChange}
              className="w-full border border-gray-400 p-2 rounded-md outline-none mb-2"
            />
            <p className="text-red-500 text-sm">{errors.stoneWeight}</p>

            <input
              name="metal"
              placeholder="Metal"
              value={earring.metal}
              onChange={handleChange}
              className="w-full border border-gray-400 p-2 rounded-md outline-none mb-2"
            />

            <input
              name="availability"
              placeholder="Availability"
              value={earring.availability}
              onChange={handleChange}
              className="w-full border border-gray-400 p-2 rounded-md outline-none mb-2"
            />

            <label className="flex gap-2">
              <input
                type="checkbox"
                name="isActive"
                checked={earring.isActive}
                onChange={handleChange}
              />
              Active Product
            </label>
          </div>

        </div>

      </form>

      {/* ACTIONS */}
      <div className="flex justify-end gap-3 mt-6">
        <button className="bg-red-400 text-white px-5 py-2 rounded-md outline-none">
          Discard
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

export default AddEarring;
