import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiTrash2 } from "react-icons/fi";

function EditNecklace() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [necklace, setNecklace] = useState({});
  const [oldImages, setOldImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [mainImageFile, setMainImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();
  const mainRef = useRef();

  // ✅ FETCH DATA
  useEffect(() => {
    fetch(`http://localhost:8080/api/necklace/${id}`)
      .then(res => res.json())
      .then(data => {
        setNecklace(data);
        setOldImages(data.images || []);
      });
  }, [id]);

  // ✅ HANDLE CHANGE
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setNecklace(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  // ✅ ADD NEW IMAGES
  const handleFiles = (e) => {
    setFiles(prev => [...prev, ...Array.from(e.target.files)]);
  };

  // ✅ REMOVE OLD IMAGE
  const removeOldImage = (index) => {
    const removed = oldImages[index];

    const updated = [...oldImages];
    updated.splice(index, 1);
    setOldImages(updated);

    // 🔥 if removed was main image
    if (removed === necklace.image) {
      setNecklace(prev => ({
        ...prev,
        image: ""
      }));
    }
  };

  // ✅ REMOVE NEW IMAGE
  const removeNewImage = (index) => {
    const updated = [...files];
    updated.splice(index, 1);
    setFiles(updated);
  };

  // ✅ UPDATE
  const handleUpdate = async () => {
    const formData = new FormData();
    setLoading(true);
    Object.entries(necklace).forEach(([key, value]) => {
      formData.append(key, value ?? "");
    });

    // MAIN IMAGE
    if (mainImageFile) {
      formData.append("image", mainImageFile);
    } else {
      formData.append("image", necklace.image || "");
    }

    // OLD IMAGES
    formData.append("existingImages", JSON.stringify(oldImages));

    // NEW IMAGES
    files.forEach(file => formData.append("images", file));

    const res = await fetch(`http://localhost:8080/api/necklace/${id}`, {
      method: "PUT",
      body: formData,
      credentials: "include"
    });

    if (res.ok) {
      alert("Updated Successfully ✅");
      navigate("/admin/dashboard");
    } else {
      alert("Update Failed ❌");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">

      <h1 className="text-2xl font-semibold mb-6">Edit Necklace</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">

          {/* PRODUCT INFO */}
          <div className="bg-white p-6 rounded-xl shadow">

            <label className="block font-medium ">Product Name </label>
            <input
              name="name"
              value={necklace.name || ""}
              onChange={handleChange}
              className="w-full border border-gray-400 p-2 rounded-lg mt-1 outline-none"
            />

            <label className="block mt-3 font-medium ">Description </label>
            <textarea
              name="description"
              value={necklace.description || ""}
              onChange={handleChange}
              rows={4}
              className="w-full border border-gray-400 p-2  rounded-lg mt-1 outline-none"
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

              {(necklace.image ||
                mainImageFile) && (

                  <div className="relative w-fit">

                    <img
                      src={
                        mainImageFile

                          ? URL.createObjectURL(
                            mainImageFile
                          )

                          : necklace.image
                      }

                      className="
            w-28
            h-28
            object-cover
            rounded-lg
            border
            border-gray-400
          "
                    />

                    {/* DELETE ICON */}

                    <button
                      type="button"

                      onClick={() => {

                        setMainImageFile(
                          null
                        );

                        setNecklace(prev => ({

                          ...prev,

                          image: ""
                        }));
                      }}

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

              {!necklace.image &&
                !mainImageFile && (

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

            <h2 className="font-semibold mb-3">Other Images</h2>

            {/* OLD IMAGES */}
            <div className="flex flex-wrap gap-3 mb-4">
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

            {/* NEW IMAGES */}
            <div className="flex flex-wrap gap-3 mb-4">
              {files.map((file, i) => (
                <div key={i} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    className="w-20 h-20 object-cover"
                  />
                  <button
                    onClick={() => removeNewImage(i)}
                    className="absolute top-0 right-0 bg-white p-1"
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

          {/* PRICE */}
          <div className="bg-white p-6 rounded-xl shadow">
            <label className="font-semibold">Price </label>
            <input
              type="number"
              name="price"
              value={necklace.price || ""}
              onChange={handleChange}
              className="w-full border border-gray-400 p-2 rounded-lg outline-none"
            />
          </div>

          {/* STOCK */}
          <div className="bg-white p-6 rounded-xl  shadow">
            <label className="font-semibold">Stock Quantity </label>
            <input
              type="number"
              name="stockquantity"
              value={necklace.stockquantity || ""}
              onChange={handleChange}
              className="w-full border border-gray-400 p-2 rounded-lg outline-none"
            />
          </div>

          {/* DETAILS */}
          <div className="bg-white p-6 rounded-xl shadow">

            <label className="font-semibold">Stone Weight </label>
            <input
              type="number"
              name="stoneWeight"
              value={necklace.stoneWeight || ""}
              onChange={handleChange}
              className="w-full border border-gray-400 p-2 rounded-lg mb-2 outline-none"
            />

            <label className="font-semibold">Bead Size</label>
            <input
              name="beadSize"
              value={necklace.beadSize || ""}
              onChange={handleChange}
              className="w-full border border-gray-400 p-2 rounded-lg mb-2 outline-none"
            />

            <label className="font-semibold">Weight Unit</label>
            <select
              name="weightUnit"
              value={necklace.weightUnit || "crt"}
              onChange={handleChange}
              className="w-full border border-gray-400 p-2 rounded-lg mb-2 outline-none"
            >
              <option value="crt">Carat</option>
              <option value="gram">Gram</option>
              <option value="ratti">Ratti</option>
            </select>

            <label className="font-semibold">Note</label>
            <textarea
              name="note"
              value={necklace.note || ""}
              onChange={handleChange}
              className="w-full border border-gray-400 p-2 rounded-lg mb-2 outline-none"
            />

            <label className="flex gap-2">
              <input
                type="checkbox"
                name="isFeatured"
                checked={necklace.isFeatured || false}
                onChange={handleChange}
              />
              Featured Product
            </label>

          </div>

        </div>

      </div>

      {/* ACTION BUTTONS */}
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

export default EditNecklace;
