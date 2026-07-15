import React, { useState, useRef } from "react";
import {
  useNavigate
} from "react-router-dom";
import { FiTrash2 } from "react-icons/fi";

function AddNecklace() {

  const [necklace, setNecklace] = useState({
    name: "",
    brand: "SwatiGemz",
    price: "",
    description: "",
    category: "Necklace",
    stockquantity: "",
    stoneWeight: "",
    beadSize: "",
    weightUnit: "crt",
    note: "",
    isFeatured: false
  });
  const navigate =
    useNavigate();
  const [mainImage, setMainImage] = useState(null);
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();
  const mainRef = useRef();

  // HANDLE INPUT
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setNecklace(prev => ({
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

    if (!necklace.name) err.name = "Name required";
    if (!necklace.price || necklace.price <= 0) err.price = "Valid price required";
    if (!necklace.description) err.description = "Description required";
    if (!necklace.stoneWeight) err.stoneWeight = "Stone weight required";
    if (!necklace.stockquantity) err.stockquantity = "Stock required";
    if (!mainImage) err.image = "Main image required";

    setErrors(err);
    return Object.keys(err).length === 0;
  };
  const resetForm = () => {
    setNecklace({
      name: "",
      brand: "SwatiGemz",
      price: "",
      description: "",
      category: "Necklace",
      stockquantity: "",
      stoneWeight: "",
      beadSize: "",
      weightUnit: "crt",
      note: "",
      isFeatured: false
    });

    setMainImage(null);
    setFiles([]);
    setErrors({});

    // optional: clear file inputs
    if (inputRef.current) inputRef.current.value = "";
    if (mainRef.current) mainRef.current.value = "";
  };
  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!validate()) return;

    const formData = new FormData();

    Object.entries(necklace).forEach(([key, value]) => {
      formData.append(key, value ?? "");
    });

    // MAIN IMAGE
    formData.append("image", mainImage);

    // EXTRA IMAGES
    files.forEach(file => formData.append("images", file));

    try {
      const res = await fetch("http://localhost:8080/api/necklace", {
        method: "POST",
        body: formData,
        credentials: "include"
      });

      const data = await res.json();
      console.log(data);

      alert("Necklace Added ✅");

      resetForm();

      navigate(
        "/admin/dashboard"
      );

    } catch (err) {
      console.error(err);
      alert("Error ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">

      <h1 className="text-2xl font-semibold mb-6">Add Necklace</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">

          {/* PRODUCT INFO */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-2">Product Information</h2>
            <p className="text-gray-400 mb-2">To add a new product, please provide the necessary details in the fields below.</p>
            <input
              name="name"
              placeholder="Product Name"
              value={necklace.name}
              onChange={handleChange}
              className="w-full  border border-gray-400 outline-none p-2 rounded-md mb-2"
            />
            <p className="text-red-500 text-sm">{errors.name}</p>

            <textarea
              name="description"
              placeholder="Description"
              value={necklace.description}
              onChange={handleChange}
              rows={5}
              className="w-full border border-gray-400 mt-3 mb-2 p-2 rounded-md outline-none"
            />
            <p className="text-red-500  text-sm">{errors.description}</p>
          </div>

          {/* MAIN IMAGE */}
          <div className="bg-white p-6 rounded-xl shadow">

            <h2 className="font-semibold mb-2">

              Main Image

            </h2>

            <div className="flex items-center gap-4 flex-wrap">

              {/* IMAGE PREVIEW */}

              {mainImage && (

                <div className="relative w-fit">

                  <img
                    src={URL.createObjectURL(mainImage)}

                    className="
            w-24
            h-24
            object-cover
            rounded-lg
            border
            border-gray-400
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

                onChange={(e) =>
                  setMainImage(
                    e.target.files[0]
                  )
                }
              />

            </div>

            <p className="text-red-500 mt-2 text-sm">

              {errors.image}

            </p>

          </div>

          {/* OTHER IMAGES */}
          <div className="bg-white p-6 rounded-xl shadow">

            <h2 className="font-semibold mb-2">Other Images</h2>

            <div
              onClick={() => inputRef.current.click()}
              className="border-2 border-dashed border-gray-400 rounded-md outline-none p-10 text-center cursor-pointer"
            >
              Upload Images
              <input
                type="file"
                multiple
                ref={inputRef}
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
            </div>

            <div className="flex flex-wrap gap-3 mt-3">
              {files.map((file, i) => (
                <div key={i} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    className="w-20 h-20 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
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

          </div>

        </div>

        {/* RIGHT */}
        <div className="space-y-6">

          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold ">Pricing</h2>
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={necklace.price}
              onChange={handleChange}
              className="w-full border border-gray-400 p-2 rounded-md outline-none"
            />
            <p className="text-red-500 mt-2 text-sm">{errors.price}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-1">Inventory</h2>
            <input
              type="number"
              name="stockquantity"
              placeholder="Stock Quantity"
              value={necklace.stockquantity}
              onChange={handleChange}
              className="w-full border border-gray-400 p-2 rounded-md outline-none"
            />
            <p className="text-red-500 mt-2 text-sm">{errors.stockquantity}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-2">Details</h2>

            <input
              type="number"
              name="stoneWeight"
              placeholder="Stone Weight"
              value={necklace.stoneWeight}
              onChange={handleChange}
              className="w-full border border-gray-400 p-2 rounded-md outline-none mb-2"
            />
            <p className="text-red-500 text-sm">{errors.stoneWeight}</p>

            <input
              name="beadSize"
              placeholder="Bead Size (e.g 2mm)"
              value={necklace.beadSize}
              onChange={handleChange}
              className="w-full border border-gray-400 p-2 rounded-md outline-none mb-2"
            />

            <select
              name="weightUnit"
              value={necklace.weightUnit}
              onChange={handleChange}
              className="w-full border border-gray-400 p-2 rounded-md outline-none mb-2"
            >
              <option value="crt">Carat</option>
              <option value="gram">Gram</option>
              <option value="ratti">Ratti</option>
            </select>

            <label className="flex gap-2">
              <input
                type="checkbox"
                name="isFeatured"
                checked={necklace.isFeatured}
                onChange={handleChange}
              />
              Featured Product
            </label>

          </div>

        </div>

      </form>

      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          onClick={resetForm}
          className="bg-red-400 text-white px-5 py-2 rounded"
        >
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

export default AddNecklace;
