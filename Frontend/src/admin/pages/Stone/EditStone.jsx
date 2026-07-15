import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiTrash2 } from "react-icons/fi";

function EditStone() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ✅ separate refs
  const mainImageRef = useRef();
  const imagesRef = useRef();

  const refs = {
    name: useRef(),
    description: useRef(),
    price: useRef(),
    stockquantity: useRef(),
    weight: useRef(),
    shape: useRef(),
    category: useRef()
  };

  const [errors, setErrors] = useState({});
  const [oldImages, setOldImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [mainImageFile, setMainImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stone, setStone] = useState({
    name: "",
    image: "",
    images: [],
    weight: "",
    shape: "",
    price: "",
    category: "",
    stockquantity: "",
    description: ""
  });

  const [stoneList, setStoneList] = useState([]);

  // ✅ fetch single stone
  useEffect(() => {
    fetch(`http://localhost:8080/api/stone/${id}`)
      .then(res => res.json())
      .then(data => {
        setStone(data);

        if (data.images && data.images.length > 0) {
          setOldImages(data.images);
        } else if (data.image) {
          setOldImages([data.image]);
        }
      });
  }, [id]);
  const removeMainImage = () => {
    setMainImageFile(null);

    setStone(prev => ({
      ...prev,
      image: "" // 🔥 tells backend main image is removed
    }));
  };
  // ✅ fetch all stones (for categories)
  useEffect(() => {
    fetch("http://localhost:8080/api/stone")
      .then(res => res.json())
      .then(data => setStoneList(data));
  }, []);

  // ✅ dynamic categories
  const categories = [
    ...new Set((stoneList || []).map(item => item.category))
  ];

  // ✅ handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setStone(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // ✅ main image upload
  const handleMainImage = (file) => {
    if (!file) return;

    setMainImageFile(file);

    setStone(prev => ({
      ...prev,
      image: URL.createObjectURL(file)
    }));
  };

  // ✅ multiple images upload
  const handleFiles = (selectedFiles) => {
    setFiles([...files, ...Array.from(selectedFiles)]);
  };

  // ✅ remove old image
  const removeOldImage = (index) => {
    const removed = oldImages[index];
    const updated = [...oldImages];
    updated.splice(index, 1);
    setOldImages(updated);

    if (removed === stone.image) {
      setStone(prev => ({ ...prev, image: "" }));
    }
  };

  // ✅ remove new image
  const removeNewImage = (index) => {
    const updated = [...files];
    updated.splice(index, 1);
    setFiles(updated);
  };

  // ✅ validation
  const validate = () => {
    let err = {};

    if (!stone.name?.trim()) err.name = "Name required";
    if (!stone.description?.trim()) err.description = "Description required";
    if (!stone.price || stone.price <= 0) err.price = "Valid price required";
    if (!stone.stockquantity || stone.stockquantity < 0)
      err.stockquantity = "Stock required";
    if (!stone.weight || stone.weight <= 0) err.weight = "Weight required";
    if (!stone.shape?.trim()) err.shape = "Shape required";
    if (!stone.category?.trim()) err.category = "Category required";

    if (!stone.image && !mainImageFile) {
      err.image = "Main image required";
    }

    if (oldImages.length === 0 && files.length === 0) {
      err.images = "At least one extra image required";
    }

    setErrors(err);

    const firstError = Object.keys(err)[0];
    if (firstError && refs[firstError]?.current) {
      refs[firstError].current.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
      refs[firstError].current.focus();
    }

    return Object.keys(err).length === 0;
  };

  // ✅ update API
  const handleUpdate = async () => {
    if (!validate()) return;
   setLoading(true);
    const formData = new FormData();

    Object.entries(stone).forEach(([key, value]) => {
      formData.append(key, value ?? "");
    });

    // main image
    if (mainImageFile) {
      formData.append("image", mainImageFile);
    } else {
      formData.append("image", stone.image || "");
    }

    // existing images
    formData.append("existingImages", JSON.stringify(oldImages));

    // new images
    files.forEach(file => formData.append("images", file));

    const res = await fetch(`http://localhost:8080/api/stone/${id}`, {
      method: "PUT",
      body: formData,
      credentials: "include"
    });

    if (res.ok) {
      alert("Updated ✅");
      navigate("/admin/dashboard");
    }
  };

  const inputClass = (field) =>
    `w-full border p-2 rounded mt-1 outline-none ${errors[field] ? "border-red-500" : "border-gray-300"
    }`;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <h1 className="text-2xl font-bold mb-6">Edit Stone</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">

          {/* INFO */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4">Product Information</h2>

            <label className="text-sm font-medium">Product Name </label>
            <input ref={refs.name} name="name" value={stone.name || ""} onChange={handleChange} className={inputClass("name")} placeholder="Name" />
            <label className="text-sm font-medium mt-3 block">Description </label>
            <textarea ref={refs.description} name="description" value={stone.description || ""} onChange={handleChange} rows={4} className={inputClass("description")} placeholder="Description" />
          </div>

          {/* MAIN IMAGE */}
         {/* MAIN IMAGE */}

<div className="bg-white p-6 rounded-xl shadow">

  <p className="text-gray-400 mb-2">

    Main Image

  </p>

  <div className="flex items-center gap-4 flex-wrap">

    {/* IMAGE PREVIEW */}

    {(stone.image ||
      mainImageFile) && (

      <div className="relative">

        <img
          src={
            mainImageFile

              ? URL.createObjectURL(
                  mainImageFile
                )

              : stone.image
          }

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

          onClick={removeMainImage}

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

    {/* BUTTON */}

    {!stone.image &&
      !mainImageFile && (

      <button
        type="button"

        onClick={() =>
          mainImageRef.current.click()
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

      ref={mainImageRef}

      className="hidden"

      onChange={(e) =>
        handleMainImage(
          e.target.files[0]
        )
      }
    />

  </div>

  {errors.image && (

    <p className="text-red-500 text-xs">

      {errors.image}

    </p>
  )}

</div>

          {/* OTHER IMAGES */}
       {/* OTHER IMAGES */}

<div className="bg-white p-6 rounded-xl shadow">

  <p className="text-gray-400 mb-2">

    Other Images

  </p>

  {/* OLD */}

  <div className="flex gap-3 flex-wrap mb-4">

    {oldImages.map((img, i) => (

      <div
        key={i}
        className="relative"
      >

        <img
          src={img}

          className="
            w-20
            h-20
            object-cover
            rounded
            border
          "
        />

        <button
          type="button"

          onClick={() =>
            removeOldImage(i)
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

  {/* NEW */}

  <div className="flex gap-3 flex-wrap mb-4">

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

        <button
          type="button"

          onClick={() =>
            removeNewImage(i)
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
        imagesRef.current.click()
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

      ref={imagesRef}

      className="hidden"

      onChange={(e) =>
        handleFiles(
          e.target.files
        )
      }
    />

  </div>

  {errors.images && (

    <p className="text-red-500 text-xs">

      {errors.images}

    </p>
  )}

</div>

        </div>

        {/* RIGHT */}
        <div className="space-y-6">

          <div className="bg-white p-6 rounded-xl shadow">
            <label className="text-sm font-medium">Price </label>
            <input type="number" ref={refs.price} name="price" value={stone.price || ""} onChange={handleChange} className={inputClass("price")} placeholder="Price" />
            <label className="text-sm font-medium">Stock Quantity </label>
            <input type="number" ref={refs.stockquantity} name="stockquantity" value={stone.stockquantity || ""} onChange={handleChange} className={inputClass("stockquantity")} placeholder="Stock" />
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <label className="text-sm font-medium">Stone Weight</label>
            <input type="number" ref={refs.weight} name="weight" value={stone.weight || ""} onChange={handleChange} className={inputClass("weight")} placeholder="Weight" />
            <label className="text-sm font-medium">Stone Shape</label>
            <input ref={refs.shape} name="shape" value={stone.shape || ""} onChange={handleChange} className={inputClass("shape")} placeholder="Shape" />
            <label className="text-sm font-medium">Category</label>
            <select ref={refs.category} name="category" value={stone.category || ""} onChange={handleChange} className={inputClass("category")}>
              <option value="">Select Category</option>
              {categories.map((cat, i) => (
                <option key={i} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

        </div>

      </div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-3 mt-6">
        <button onClick={() => navigate("/admin/dashboard")} className="bg-red-500 text-white px-5 py-2 rounded">
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

export default EditStone;
