import React, { useState, useRef } from "react";
import { FiTrash2 } from "react-icons/fi";
import {
  useNavigate
} from "react-router-dom";

function AddRing() {
  const [ring, setRing] = useState({
    name: "",
    price: "",
    description: "",
    category: "Ring",
    stockquantity: "",
    ringSize: "",
    stoneWeight: "",
    metal: "",
    weightUnit: "crt",
    isFeatured: false
  });
  const navigate =
    useNavigate();
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const inputRef = useRef();
  const [loading, setLoading] = useState(false);
  // HANDLE INPUT
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRing({
      ...ring,
      [name]: type === "checkbox" ? checked : value
    });
  };

  // FILE HANDLING
  const handleFiles = (selectedFiles) => {
    const newFiles = Array.from(selectedFiles);
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const removeFile = (index) => {
    const updated = [...files];
    updated.splice(index, 1);
    setFiles(updated);
  };

  // VALIDATION
  const validate = () => {
    let err = {};

    if (!ring.name) err.name = "Name required";
    if (!ring.price || ring.price <= 0) err.price = "Valid price required";
    if (!ring.description) err.description = "Description required";
    if (!ring.stockquantity) err.stockquantity = "Stock required";
    if (!ring.ringSize) err.ringSize = "Ring size required";
    if (!ring.stoneWeight) err.stoneWeight = "Stone weight size required";
    if (!ring.metal) err.metal = "Metal is required";
    if (files.length === 0) err.image = "At least one image required";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // RESET
  const resetForm = () => {
    setRing({
      name: "",
      price: "",
      description: "",
      category: "Ring",
      stockquantity: "",
      ringSize: "",
      stoneWeight: "",
      metal: "",
      weightUnit: "crt",
      isFeatured: false
    });
    setFiles([]);
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    console.log(ring);
    const formData = new FormData();

    formData.append("name", ring.name);
    formData.append("price", Number(ring.price));
    formData.append("description", ring.description);
    formData.append("category", ring.category);
    formData.append("stockquantity", Number(ring.stockquantity));
    formData.append("ringSize", Number(ring.ringSize));
    formData.append(
      "stoneWeight",
      ring.stoneWeight
    );
    formData.append("metal", ring.metal);
    formData.append("weightUnit", ring.weightUnit);
    formData.append("isFeatured", ring.isFeatured);

    // FIRST IMAGE = MAIN IMAGE
    if (files[0]) {

      formData.append(
        "image",
        files[0]
      );
    }

    // OTHER IMAGES
    files
      .slice(1)
      .forEach((file) => {

        formData.append(
          "images",
          file
        );
      });

    try {
      const res = await fetch("http://localhost:8080/api/menrings", {
        method: "POST",
        body: formData,
        credentials: "include"
      });

      const data = await res.json();

      alert("Product Added ✅");

      resetForm();

      navigate("/admin/dashboard");


    } catch (err) {
      console.error(err);
      alert("Error ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">

      <h1 className="text-2xl font-semibold mb-6">Add Product</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">

          {/* PRODUCT INFO */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-2">Product Information</h2>
            <p className="text-gray-400">To add a new product, please provide the necessary details in the fields below.</p>
            <input
              name="name"
              placeholder="Product Name"
              value={ring.name}
              onChange={handleChange}
              className="w-full border border-gray-400 p-2  text-gray-600 outline-none rounded-md mt-3"
            />
            <p className="text-red-500 text-sm">{errors.name}</p>

            <textarea
              name="description"
              placeholder="Description"
              value={ring.description}
              onChange={handleChange}
              rows={5}
              className="w-full border rounded mt-3 mb-2 border-gray-400 p-2  text-gray-600 outline-none"
            />
            <p className="text-red-500 text-sm">{errors.description}</p>
          </div>

          {/* IMAGE UPLOAD */}
          {/* IMAGE UPLOAD */}

          

            <h2 className="text-lg font-semibold mb-4">

              Product Images

            </h2>

            {/* MAIN IMAGE */}

            <div className="bg-white p-6 rounded-xl shadow">

              <p className="text-gray-500 mb-3 font-medium">

                Main Image

              </p>

              <div className="flex items-center gap-4 flex-wrap">

                {/* MAIN PREVIEW */}

                {files[0] && (

                  <div className="relative w-fit">

                    <img
                      src={URL.createObjectURL(files[0])}

                      className="
        w-28
        h-28
        rounded-lg
        object-cover
        border
      "
                    />

                    {/* DELETE ICON */}

                    <button
                      type="button"

                      onClick={() => {

                        const updated =
                          [...files];

                        updated.splice(0, 1);

                        setFiles(updated);
                      }}

                      className="
        absolute
        top-1
        right-1
        bg-white
        rounded-full
        p-1
        shadow
      "
                    >

                      <FiTrash2 className="text-red-500 text-sm" />

                    </button>

                  </div>
                )}

                {/* ADD MAIN IMAGE */}
                {!files[0] && (

                  <button
                    type="button"

                    onClick={() =>
                      document
                        .getElementById(
                          "mainImageInput"
                        )
                        .click()
                    }

                    className="
      mt-3
      px-4
      py-2
      bg-gray-200
      rounded
    "
                  >

                    Browse Main Image

                  </button>
                )}

                <input
                  id="mainImageInput"

                  type="file"

                  accept="image/*"

                  className="hidden"

                  onChange={(e) => {

                    if (
                      e.target.files[0]
                    ) {

                      const otherImages =
                        files.slice(1);

                      setFiles([
                        e.target.files[0],
                        ...otherImages
                      ]);
                    }
                  }}
                />

              </div>

              {errors.image && (

                <p className="text-red-500 text-sm mt-2">

                  {errors.image}

                </p>
              )}

            </div>

            {/* OTHER IMAGES */}

            <div className="bg-white p-6 rounded-xl shadow">

              <p className="text-gray-500 mb-3 font-medium">

                Other Images

              </p>

              <div className="flex flex-wrap gap-4">

                {/* OTHER PREVIEW */}
                {files.slice(1).map(
                  (file, index) => (

                    <div
                      key={index}
                      className="relative w-fit"
                    >

                      <img
                        src={URL.createObjectURL(file)}

                        className="
          w-24
          h-24
          rounded-lg
          object-cover
          border
        "
                      />

                      {/* DELETE ICON */}

                      <button
                        type="button"

                        onClick={() => {

                          const updated =
                            [...files];

                          updated.splice(
                            index + 1,
                            1
                          );

                          setFiles(updated);
                        }}

                        className="
          absolute
          top-1
          right-1
          bg-white
          rounded-full
          p-1
          shadow
        "
                      >

                        <FiTrash2 className="text-red-500 text-sm" />

                      </button>

                    </div>
                  )
                )}

                {/* ADD OTHER */}
                <div className="flex items-center justify-center">
                  <button
                    type="button"

                    onClick={() =>
                      document
                        .getElementById(
                          "otherImagesInput"
                        )
                        .click()
                    }

                    className="
  h-10
    px-4
    py-2
    bg-gray-200
    rounded
  "
                  >

                    Browse Other Images

                  </button>
                </div>
                <input
                  id="otherImagesInput"

                  type="file"

                  multiple

                  accept="image/*"

                  className="hidden"

                  onChange={(e) => {

                    const newFiles =
                      Array.from(
                        e.target.files
                      );

                    setFiles(prev => [

                      ...prev,

                      ...newFiles
                    ]);
                  }}
                />

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
              value={ring.price}
              onChange={handleChange}
              className="w-full border border-gray-400 p-2  text-gray-600 outline-none rounded-lg mt-3"
            />
            <p className="text-red-500 text-sm">{errors.price}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-1">Inventory</h2>

            <input
              type="number"
              name="stockquantity"
              placeholder="Stock Quantity"
              value={ring.stockquantity}
              onChange={handleChange}
              className="w-full border border-gray-400 p-2  text-gray-600 outline-none rounded-lg mt-3"
            />
            <p className="text-red-500 text-sm">{errors.stockquantity}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-2">Details</h2>

            <input
              type="number"
              name="ringSize"
              placeholder="Ring Size"
              value={ring.ringSize}
              onChange={handleChange}
              className="w-full border border-gray-400 p-2  text-gray-600 outline-none rounded-lg mt-1"
            />
            <p className="text-red-500 mt-2 text-sm">{errors.ringSize}</p>

            <input
              type="number"
              name="stoneWeight"
              placeholder="Stone Weight"
              value={ring.stoneWeight}
              onChange={handleChange}
              className="w-full border border-gray-400 p-2  text-gray-600 outline-none rounded-lg mt-3"
            />
            <p className="text-red-500 mt-2 text-sm">{errors.stoneWeight}</p>
            <input
              name="metal"
              placeholder="Metal"
              value={ring.metal}
              onChange={handleChange}
              className="w-full border border-gray-400 p-2  text-gray-600 outline-none rounded-lg mt-3"
            />
            <p className="text-red-500 mt-2 text-sm">{errors.metal}</p>
            <select
              name="weightUnit"
              value={ring.weightUnit}
              onChange={handleChange}
              className="w-full border border-gray-400 p-2  text-gray-600 outline-none rounded-lg mt-3"
            >
              <option value="crt">Carat</option>
              <option value="gram">Gram</option>
              <option value="ratti">Ratti</option>
            </select>

            <label className="flex gap-2 mt-3">
              <input
                type="checkbox"
                name="isFeatured"
                checked={ring.isFeatured}
                onChange={handleChange}
              />
              Featured Product
            </label>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold ">Category</h2>

            <select
              name="category"
              value={ring.category}
              onChange={handleChange}
              className="w-full border border-gray-400 p-2  text-gray-600 outline-none rounded-lg mt-3"
            >
              <option value="Ring">Ring</option>
              <option value="Stone">Stone</option>
            </select>
          </div>

        </div>

      </form>

      {/* BUTTONS */}
      <div className="flex justify-end gap-3 mt-6">
        <button
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

export default AddRing;
