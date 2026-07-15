import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiTrash2 } from "react-icons/fi";

function EditRing() {

    const { id } = useParams();

    const navigate = useNavigate();

    const refs = {

        name: useRef(),

        description: useRef(),

        price: useRef(),

        stockquantity: useRef(),

        ringSize: useRef(),

        metal: useRef(),

        stoneWeight: useRef()
    };

    const [errors, setErrors] = useState({});

    const [loading, setLoading] = useState(false);

    const [oldImages, setOldImages] = useState([]);

    const [mainImageFile, setMainImageFile] = useState(null);

    const [files, setFiles] = useState([]);

    const [ring, setRing] = useState({

        name: "",

        price: "",

        description: "",

        stockquantity: "",

        ringSize: "",

        stoneWeight: "",

        metal: "",

        weightUnit: "crt",

        isFeatured: false,

        category: "Ring",

        image: ""
    });

    useEffect(() => {

        fetch(`http://localhost:8080/api/menrings/${id}`)

            .then(res => res.json())

            .then(data => {

                setRing(data);

                /* CLEAN OTHER IMAGES */

                const filteredImages =

                    (data.images || []).filter(

                        img =>

                            img &&

                            img !== data.image
                    );

                setOldImages(filteredImages);
            });

    }, [id]);

    const handleChange = (e) => {

        const {

            name,

            value,

            type,

            checked

        } = e.target;

        setRing(prev => ({

            ...prev,

            [name]:

                type === "checkbox"

                    ? checked

                    : type === "number" && value === ""

                        ? ""

                        : value
        }));
    };

    const validate = () => {

        let err = {};

        if (!ring.name?.trim())
            err.name = "Product name is required";

        if (!ring.description?.trim())
            err.description = "Description is required";

        if (!ring.price || ring.price <= 0)
            err.price = "Valid price required";

        if (!ring.stockquantity || ring.stockquantity < 0)
            err.stockquantity = "Stock required";

        if (!ring.ringSize)
            err.ringSize = "Ring size required";

        if (!ring.metal?.trim())
            err.metal = "Metal is required";

        if (!ring.stoneWeight)
            err.stoneWeight = "Stone weight is required";

        if (

            oldImages.length === 0 &&

            files.length === 0 &&

            !mainImageFile &&

            !ring.image

        ) {

            err.images =
                "At least one image is required";
        }

        setErrors(err);

        const firstErrorKey =
            Object.keys(err)[0];

        if (

            firstErrorKey &&

            refs[firstErrorKey]?.current

        ) {

            refs[firstErrorKey]
                .current
                .scrollIntoView({

                    behavior: "smooth",

                    block: "center"
                });

            refs[firstErrorKey]
                .current
                .focus();
        }

        return Object.keys(err).length === 0;
    };

    const removeOldImage = (index) => {

        const removed =
            oldImages[index];

        const updated =
            [...oldImages];

        updated.splice(index, 1);

        setOldImages(updated);

        if (
            removed === ring.image
        ) {

            setRing(prev => ({

                ...prev,

                image: ""
            }));
        }
    };

    const handleUpdate = async () => {

        if (!validate()) return;

        setLoading(true);

        try {

            const formData =
                new FormData();

            Object.entries(ring).forEach(

                ([key, value]) => {

                    formData.append(
                        key,
                        value ?? ""
                    );
                }
            );

            /* EXISTING OTHER IMAGES */

            formData.append(

                "existingImages",

                JSON.stringify(oldImages)
            );

            /* MAIN IMAGE */

            if (mainImageFile) {

                formData.append(

                    "image",

                    mainImageFile
                );

            } else {

                formData.append(

                    "image",

                    ring.image || ""
                );
            }

            /* OTHER IMAGES */

            files.forEach(file => {

                formData.append(

                    "images",

                    file
                );
            });

            const res = await fetch(

                `http://localhost:8080/api/menrings/${id}`,

                {

                    method: "PUT",

                    body: formData,
                    credentials: "include"
                }
            );

            const data =
                await res.json();

            if (data.success) {

                alert("Updated Successfully ✅");

                navigate("/admin/dashboard");

            } else {

                alert("Update Failed ❌");
            }

        } catch (err) {

            console.log(err);

        } finally {

            setLoading(false);
        }
    };

    const inputClass = (field) =>

        `w-full border p-2 rounded mt-1 outline-none ${

            errors[field]

                ? "border-red-500"

                : "border-gray-300"
        }`;

    return (

        <div className="p-6 bg-gray-100 min-h-screen">

            <h1 className="text-2xl font-bold mb-6">

                Edit Ring

            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* LEFT */}

                <div className="lg:col-span-2 space-y-6">

                    {/* PRODUCT INFO */}

                    <div className="bg-white p-6 rounded-xl shadow">

                        <h2 className="text-lg font-semibold mb-4">

                            Product Information

                        </h2>

                        <label className="text-sm font-medium">

                            Product Name
                        </label>

                        <input
                            ref={refs.name}
                            name="name"
                            value={ring.name || ""}
                            onChange={handleChange}
                            className={inputClass("name")}
                        />

                        {errors.name && (

                            <p className="text-red-500 text-xs">

                                {errors.name}

                            </p>
                        )}

                        <label className="text-sm font-medium mt-3 block">

                            Description

                        </label>

                        <textarea
                            ref={refs.description}
                            name="description"
                            value={ring.description || ""}
                            onChange={handleChange}
                            rows={5}
                            className={inputClass("description")}
                        />

                        {errors.description && (

                            <p className="text-red-500 text-xs">

                                {errors.description}

                            </p>
                        )}

                    </div>

                    {/* IMAGES */}
                        {/* MAIN IMAGE */}

                        <div className="bg-white p-6 rounded-xl shadow">

                            <h3 className="font-semibold mb-4 text-gray-600">

                                Main Image

                            </h3>

                            <div className="flex flex-wrap gap-4">

                                {/* OLD MAIN */}

                                {ring.image && !mainImageFile && (

                                    <div className="relative">

                                        <img
                                            src={ring.image}
                                            className="
                                                w-36
                                                h-36
                                                object-cover
                                                rounded-xl
                                                border
                                            "
                                        />

                                        <button
                                            type="button"

                                            onClick={() => {

                                                setRing(prev => ({

                                                    ...prev,

                                                    image: ""
                                                }));
                                            }}

                                            className="
                                                absolute
                                                top-2
                                                right-2
                                                bg-white
                                                p-2
                                                rounded-full
                                                shadow
                                            "
                                        >

                                            <FiTrash2 className="text-red-500" />

                                        </button>

                                    </div>
                                )}

                                {/* NEW MAIN */}

                                {mainImageFile && (

                                    <div className="relative">

                                        <img
                                            src={URL.createObjectURL(mainImageFile)}
                                            className="
                                                w-36
                                                h-36
                                                object-cover
                                                rounded-xl
                                                border
                                            "
                                        />

                                        <button
                                            type="button"

                                            onClick={() =>
                                                setMainImageFile(null)
                                            }

                                            className="
                                                absolute
                                                top-2
                                                right-2
                                                bg-white
                                                p-2
                                                rounded-full
                                                shadow
                                            "
                                        >

                                            <FiTrash2 className="text-red-500" />

                                        </button>

                                    </div>
                                )}

                                {/* BUTTON */}

                                {!ring.image && !mainImageFile && (

                                    <label className="
                                        h-11
                                        px-5
                                        bg-gray-200
                                        rounded-xl
                                        flex
                                        items-center
                                        justify-center
                                        cursor-pointer
                                        text-sm
                                    ">

                                        Browse Main Image

                                        <input
                                            type="file"
                                            hidden
                                            accept="image/*"

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

                                    </label>
                                )}

                            </div>

                        </div>

                        {/* OTHER IMAGES */}

                        <div className="bg-white p-6 rounded-xl shadow">

                            <h3 className="font-semibold mb-4 text-gray-600">

                                Other Images

                            </h3>

                            <div className="flex flex-wrap gap-4 items-center">

                                {/* OLD */}

                                {oldImages.map((img, i) => (

                                    <div
                                        key={i}
                                        className="relative"
                                    >

                                        <img
                                            src={img}
                                            className="
                                                w-28
                                                h-28
                                                object-cover
                                                rounded-xl
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
                                                top-2
                                                right-2
                                                bg-white
                                                p-2
                                                rounded-full
                                                shadow
                                            "
                                        >

                                            <FiTrash2 className="text-red-500 text-sm" />

                                        </button>

                                    </div>
                                ))}

                                {/* NEW */}

                                {files.map((file, i) => (

                                    <div
                                        key={i}
                                        className="relative"
                                    >

                                        <img
                                            src={URL.createObjectURL(file)}
                                            className="
                                                w-28
                                                h-28
                                                object-cover
                                                rounded-xl
                                                border
                                            "
                                        />

                                        <button
                                            type="button"

                                            onClick={() => {

                                                const updated =
                                                    [...files];

                                                updated.splice(i, 1);

                                                setFiles(updated);
                                            }}

                                            className="
                                                absolute
                                                top-2
                                                right-2
                                                bg-white
                                                p-2
                                                rounded-full
                                                shadow
                                            "
                                        >

                                            <FiTrash2 className="text-red-500 text-sm" />

                                        </button>

                                    </div>
                                ))}

                                {/* ADD */}

                                <label className="
                                    h-11
                                    px-5
                                    bg-gray-200
                                    rounded-xl
                                    flex
                                    items-center
                                    justify-center
                                    cursor-pointer
                                    text-sm
                                ">

                                    Browse Other Images

                                    <input
                                        type="file"
                                        hidden
                                        multiple

                                        onChange={(e) => {

                                            setFiles(prev => [

                                                ...prev,

                                                ...Array.from(
                                                    e.target.files
                                                )
                                            ]);
                                        }}
                                    />

                                </label>

                            </div>

                        </div>

                        {errors.images && (

                            <p className="text-red-500 text-sm">

                                {errors.images}

                            </p>
                        )}

                    

                </div>

                {/* RIGHT */}

                <div className="space-y-6">

                    <div className="bg-white p-6 rounded-xl shadow">

                        <label className="text-sm font-medium">

                            Price

                        </label>

                        <input
                            ref={refs.price}
                            type="number"
                            name="price"
                            value={ring.price || ""}
                            onChange={handleChange}
                            className={inputClass("price")}
                        />

                    </div>

                    <div className="bg-white p-6 rounded-xl shadow">

                        <label className="text-sm font-medium">

                            Stock Quantity

                        </label>

                        <input
                            ref={refs.stockquantity}
                            type="number"
                            name="stockquantity"
                            value={ring.stockquantity || ""}
                            onChange={handleChange}
                            className={inputClass("stockquantity")}
                        />

                    </div>

                    <div className="bg-white p-6 rounded-xl shadow space-y-3">

                        <div>

                            <label className="text-sm">

                                Ring Size

                            </label>

                            <input
                                ref={refs.ringSize}
                                type="number"
                                name="ringSize"
                                value={ring.ringSize || ""}
                                onChange={handleChange}
                                className={inputClass("ringSize")}
                            />

                        </div>

                        <div>

                            <label className="text-sm">

                                Stone Weight

                            </label>

                            <input
                                ref={refs.stoneWeight}
                                type="number"
                                name="stoneWeight"
                                value={ring.stoneWeight || ""}
                                onChange={handleChange}
                                className={inputClass("stoneWeight")}
                            />

                        </div>

                        <div>

                            <label className="text-sm">

                                Metal

                            </label>

                            <input
                                ref={refs.metal}
                                name="metal"
                                value={ring.metal || ""}
                                onChange={handleChange}
                                className={inputClass("metal")}
                            />

                        </div>

                        <div>

                            <label className="text-sm">

                                Weight Unit

                            </label>

                            <select
                                name="weightUnit"
                                value={ring.weightUnit}
                                onChange={handleChange}
                                className="w-full border p-2 rounded mt-1"
                            >

                                <option value="crt">

                                    Carat

                                </option>

                                <option value="gram">

                                    Gram

                                </option>

                                <option value="ratti">

                                    Ratti

                                </option>

                            </select>

                        </div>

                        <label className="flex gap-2">

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

            </div>

            {/* BUTTONS */}

            <div className="flex justify-end gap-3 mt-6">

                <button
                    onClick={() =>
                        navigate("/admin/dashboard")
                    }

                    className="
                        bg-red-500
                        text-white
                        px-5
                        py-2
                        rounded
                    "
                >

                    Discard

                </button>

                <button
                    onClick={handleUpdate}
                    disabled={loading}

                    className="
                        bg-green-600
                        text-white
                        px-6
                        py-2
                        rounded
                    "
                >

                    {loading
                        ? "Updating..."
                        : "Update"}

                </button>

            </div>

        </div>
    );
}

export default EditRing;
