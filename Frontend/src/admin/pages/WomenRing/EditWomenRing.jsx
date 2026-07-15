import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiTrash2 } from "react-icons/fi";

function EditWomenRing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [ring, setRing] = useState({});
  const [oldImages, setOldImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [mainImageFile, setMainImageFile] = useState(null);

  const inputRef = useRef();

  // FETCH DATA
  useEffect(() => {
    fetch(`http://localhost:8080/api/womenrings/${id}`)
      .then(res => res.json())
      .then(data => {
        setRing(data);
        setOldImages(data.images || []);
      });
  }, [id]);

  // HANDLE CHANGE
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setRing(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  // ADD NEW IMAGES
  const handleFiles = (e) => {
    setFiles([...files, ...Array.from(e.target.files)]);
  };

  // REMOVE OLD IMAGE
  const removeOldImage = (index) => {
    const removed = oldImages[index];

    const updated = [...oldImages];
    updated.splice(index, 1);
    setOldImages(updated);

    // 🔥 if main deleted
    if (removed === ring.image) {
      setRing(prev => ({
        ...prev,
        image: ""
      }));
    }
  };

  // REMOVE NEW IMAGE
  const removeNewImage = (index) => {
    const updated = [...files];
    updated.splice(index, 1);
    setFiles(updated);
  };

  // UPDATE
  const handleUpdate = async () => {
    const formData = new FormData();
    setLoading(true);
    Object.entries(ring).forEach(([key, value]) => {
      formData.append(key, value ?? "");
    });

    // MAIN IMAGE
    if (mainImageFile) {
      formData.append("image", mainImageFile);
    } else {
      formData.append("image", ring.image || "");
    }

    // OLD IMAGES
    formData.append("existingImages", JSON.stringify(oldImages));

    // NEW IMAGES
    files.forEach(file => formData.append("images", file));

    const res = await fetch(`http://localhost:8080/api/womenrings/${id}`, {
      method: "PUT",
      body: formData,
      credentials: "include"
    });

    if (res.ok) {
      alert("Updated Successfully ✅");
      navigate("/admin/dashboard");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <h1 className="text-2xl font-bold mb-6">Edit Women Ring</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">

          {/* PRODUCT INFO */}
          <div className="bg-white p-6 rounded-xl shadow">

            <label className="text-gray-500">Product Name </label>
            <input
              name="name"
              value={ring.name || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1 outline-none  border-gray-400"
            />

            <label className="mt-3 block text-gray-500">Description </label>
            <textarea
              name="description"
              value={ring.description || ""}
              onChange={handleChange}
              rows={4}
              className="w-full border p-2 rounded mt-1 outline-none border-gray-400"
            />

          </div>

          {/* MAIN IMAGE */}

          <div className="bg-white p-6 rounded-xl shadow">

            <h3 className="font-semibold mb-3 text-gray-500">

              Main Image

            </h3>

            <div className="flex items-center gap-4 flex-wrap">

              {/* IMAGE PREVIEW */}

              {(ring.image || mainImageFile) && (

                <div className="relative w-fit">

                  <img
                    src={
                      mainImageFile

                        ? URL.createObjectURL(
                          mainImageFile
                        )

                        : ring.image
                    }

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

                    onClick={() => {

                      setMainImageFile(
                        null
                      );

                      setRing(prev => ({

                        ...prev,

                        image: ""
                      }));
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

              {/* ADD BUTTON */}

              {!ring.image &&
                !mainImageFile && (

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
                id="mainImageInput"

                type="file"

                accept="image/*"

                className="hidden"

                onChange={(e) => {

                  if (
                    e.target.files[0]
                  ) {

                    setMainImageFile(
                      e.target.files[0]
                    );
                  }
                }}
              />

            </div>

          </div>
          {/* OTHER IMAGES */}
          <div className="bg-white p-6 rounded-xl shadow">

            <h3 className="font-semibold mb-3 text-gray-500">Other Images</h3>

            {/* OLD */}
            <div className="flex gap-3 flex-wrap mb-4">
              {oldImages.map((img, i) => (
                <div key={i} className="relative">
                  <img src={img} className="w-20 h-20 object-cover" />
                  <button
                    onClick={() => removeOldImage(i)}
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

            {/* NEW */}
            <div className="flex gap-3 flex-wrap  mb-4">
              {files.map((file, i) => (
                <div key={i} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    className="w-20 h-20 object-cover "
                  />
                  <button
                    onClick={() => removeNewImage(i)}
                    className="absolute top-0 right-0 bg-white"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-center">

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
                id="otherImagesInput"

                type="file"

                multiple

                className="hidden"

                onChange={handleFiles}
              />

            </div>
          </div>

        </div>

        {/* RIGHT */}
        <div className="space-y-6">

          <div className="bg-white p-6 rounded-xl shadow">
            <label className="text-gray-500">Price </label>
            <input
              type="number"
              name="price"
              value={ring.price || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded outline-none border-gray-400"
            />
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <label className="text-gray-500">Stock Quantity </label>
            <input
              type="number"
              name="stockquantity"
              value={ring.stockquantity || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded outline-none border-gray-400"
            />
          </div>

          <div className="bg-white p-6 rounded-xl shadow">

            <label className="text-gray-500">Ring Size </label>
            <input
              type="number"
              name="ringSize"
              value={ring.ringSize || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded outline-none border-gray-400"
            />

            <label className="mt-2 block text-gray-500">Stone Weight </label>
            <input
              type="number"
              name="stoneWeight"
              value={ring.stoneWeight || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded outline-none border-gray-400"
            />

            <label className="mt-2 block">Metal</label>
            <input
              name="metal"
              value={ring.metal || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded outline-none border-gray-400"
            />

            <label className="mt-2 block">Weight Unit</label>
            <select
              name="weightUnit"
              value={ring.weightUnit || "crt"}
              onChange={handleChange}
              className="w-full border p-2 rounded outline-none border-gray-400"
            >
              <option value="crt">Carat</option>
              <option value="gram">Gram</option>
              <option value="ratti">Ratti</option>
            </select>

            <label className="flex gap-2 mt-3">
              <input
                type="checkbox"
                name="isFeatured"
                checked={ring.isFeatured || false}
                onChange={handleChange}
              />
              Featured Product
            </label>

          </div>

        </div>

      </div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="bg-red-500 text-white px-5 py-2 rounded"
        >
          Cancel
        </button>
        <button
          onClick={handleUpdate}
          disabled={loading}
          className="bg-green-600 text-white px-6 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update"}
        </button>
      </div>

    </div>
  );
}

export default EditWomenRing;
