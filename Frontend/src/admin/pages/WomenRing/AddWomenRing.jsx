import React, { useState, useRef } from "react";
import {
    useNavigate
} from "react-router-dom";


function AddWomenRing() {
    const [ring, setRing] = useState({
        name: "",
        price: "",
        description: "",
        category: "WomenRing",
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
    const [mainImage, setMainImage] = useState(null);
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
        if (!ring.stoneWeight) err.stoneWeight = "Stone weight required";
        if (!ring.metal) err.metal = "Metal required";
        if (!mainImage) err.image = "Main image required";

        setErrors(err);
        return Object.keys(err).length === 0;
    };

    // RESET
    const resetForm = () => {
        setRing({
            name: "",
            price: "",
            description: "",
            category: "WomenRing",
            stockquantity: "",
            ringSize: "",
            stoneWeight: "",
            metal: "",
            weightUnit: "crt",
            isFeatured: false
        });
        setFiles([]);
        setMainImage(null);
    };

    // SUBMIT
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        const formData = new FormData();

        formData.append("name", ring.name);
        formData.append("price", Number(ring.price));
        formData.append("description", ring.description);
        formData.append("category", ring.category);
        formData.append("stockquantity", Number(ring.stockquantity));
        formData.append("ringSize", Number(ring.ringSize));
        formData.append("stoneWeight", Number(ring.stoneWeight));
        formData.append("metal", ring.metal);
        formData.append("weightUnit", ring.weightUnit);
        formData.append("isFeatured", ring.isFeatured);

        // MAIN IMAGE
        // MAIN IMAGE
        formData.append("image", mainImage);

        // EXTRA IMAGES
        files.forEach((file) => {
            formData.append("images", file);
        });

        try {
            const res = await fetch("http://localhost:8080/api/womenrings", {
                method: "POST",
                body: formData,
                credentials: "include"
            });

            const data = await res.json();
            console.log(data);

            alert("Women Ring Added ✅");

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

            <h1 className="text-2xl font-semibold mb-6">Add Women Ring</h1>

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
                            className="w-full border border-gray-400 p-2 text-gray-600 outline-none rounded-md mt-3"
                        />
                        <p className="text-red-500 mt-2 text-sm">{errors.name}</p>

                        <textarea
                            name="description"
                            placeholder="Description"
                            value={ring.description}
                            onChange={handleChange}
                            rows={5}
                            className="w-full border rounded mt-3 mb-2 border-gray-400 p-2 text-gray-600 outline-none"
                        />
                        <p className="text-red-500 text-sm">{errors.description}</p>
                    </div>

                    {/* MAIN IMAGE */}
                    <div className="bg-white p-6 rounded-xl shadow">

                        <h2 className="text-lg font-semibold mb-2">Main Image</h2>

                        <div
                            onClick={() => document.getElementById("mainImageInput").click()}
                            className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center cursor-pointer"
                        >
                            {mainImage ? (
                                <img
                                    src={URL.createObjectURL(mainImage)}
                                    className="w-24 h-24 object-cover mx-auto"
                                />
                            ) : (
                                "Click to upload main image"
                            )}

                            <input
                                id="mainImageInput"
                                type="file"
                                className="hidden"
                                onChange={(e) => setMainImage(e.target.files[0])}
                            />
                        </div>

                        <p className="text-red-500 text-sm mt-2">{errors.image}</p>
                    </div>
                    {/* IMAGE */}
                    <div className="bg-white p-6 rounded-xl shadow">

                        <h2 className="text-lg font-semibold mb-2">Other Images</h2>

                        <div
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleDrop}
                            onClick={() => inputRef.current.click()}
                            className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center cursor-pointer"
                        >
                            Drop files here or click to upload
                            <input
                                type="file"
                                multiple
                                ref={inputRef}
                                className="hidden"
                                onChange={(e) => handleFiles(e.target.files)}
                            />
                        </div>

                        <p className="text-red-500 text-sm mt-2">{errors.image}</p>

                        <div className="mt-4 space-y-2">
                            {files.map((file, index) => (
                                <div key={index} className="flex justify-between items-center">
                                    <img src={URL.createObjectURL(file)} className="w-10 h-10" />
                                    <button onClick={() => removeFile(index)}>✕</button>
                                </div>
                            ))}
                        </div>

                    </div>

                </div>

                {/* RIGHT */}
                <div className="space-y-6">

                    <div className="bg-white p-6 rounded-xl shadow">
                        <h2 className="text-lg font-semibold mb-2">Pricing</h2>
                        <input
                            type="number"
                            name="price"
                            placeholder="Price"
                            value={ring.price}
                            onChange={handleChange}
                            className="w-full border border-gray-400 outline-none p-2 rounded-lg"
                        />
                        <p className="text-red-500 text-sm mt-2">{errors.price}</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow">
                        <h2 className="text-lg font-semibold mb-2">Inventory</h2>
                        <input
                            type="number"
                            name="stockquantity"
                            placeholder="Stock Quantity"
                            value={ring.stockquantity}
                            onChange={handleChange}
                            className="w-full border border-gray-400 outline-none rounded-lg p-2"
                        />
                        <p className="text-red-500 text-sm mt-2">{errors.stockquantity}</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow">
                        <h2 className="text-lg font-semibold mb-2">Details</h2>
                        <input
                            type="number"
                            name="ringSize"
                            placeholder="Ring Size"
                            value={ring.ringSize}
                            onChange={handleChange}
                            className="w-full border border-gray-400 outline-none rounded-lg p-2"
                        />
                        <p className="text-red-500 mt-2 text-sm">{errors.ringSize}</p>

                        <input
                            type="number"
                            name="stoneWeight"
                            placeholder="Stone Weight"
                            value={ring.stoneWeight}
                            onChange={handleChange}
                            className="w-full border border-gray-400 outline-none rounded-lg p-2 mt-2"
                        />
                        <p className="text-red-500 mt-2 text-sm">{errors.stoneWeight}</p>
                        <input
                            name="metal"
                            placeholder="Metal"
                            value={ring.metal}
                            onChange={handleChange}
                            className="w-full border border-gray-400 outline-none rounded-lg p-2 mt-2"
                        />
                        <p className="text-red-500 mt-2 text-sm">{errors.metal}</p>
                        <select
                            name="weightUnit"
                            value={ring.weightUnit}
                            onChange={handleChange}
                            className="w-full border border-gray-400 outline-none rounded-lg p-2 mt-2"
                        >
                            <option value="crt">Carat</option>
                            <option value="gram">Gram</option>
                            <option value="ratti">Ratti</option>
                        </select>

                        <label className="flex gap-2 mt-2">
                            <input
                                type="checkbox"
                                name="isFeatured"
                                checked={ring.isFeatured}
                                onChange={handleChange}
                            />
                            Featured Product
                        </label>

                    </div>

                </div>

            </form>

            <div className="flex justify-end gap-3 mt-6">
                <button onClick={resetForm} className="bg-red-400 text-white px-5 py-2 rounded">
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

export default AddWomenRing;
