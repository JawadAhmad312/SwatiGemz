import React, {
    useState,
    useRef,
} from "react";
import {
    useNavigate,
} from "react-router-dom";



const AddCollection = () => {

    const [collection, setCollection] =
        useState({
            name: "",
            slug: "",
            description: "",
            active: true,
        });
    const navigate =
        useNavigate();
    const [mainImage, setMainImage] =
        useState(null);

    const [errors, setErrors] =
        useState({});

    const mainRef = useRef();

    // HANDLE CHANGE

    const handleChange = (e) => {

        const {
            name,
            value,
            type,
            checked,
        } = e.target;

        let updatedData = {
            ...collection,

            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        };

        // AUTO SLUG GENERATE

        if (name === "name") {

            updatedData.slug = value
                .toLowerCase()
                .trim()
                .split(" ")
                .slice(0, 2)
                .join("-")
                .replace(/[^\w-]+/g, "");
        }

        setCollection(updatedData);
    };

    // VALIDATION

    const validate = () => {

        let err = {};

        if (!collection.name)
            err.name =
                "Collection name required";

        if (!collection.slug)
            err.slug =
                "Slug required";

        if (!collection.description)
            err.description =
                "Description required";

        if (!mainImage)
            err.image =
                "Image required";

        setErrors(err);

        return (
            Object.keys(err).length === 0
        );
    };

    // RESET FORM

    const resetForm = () => {

        setCollection({
            name: "",
            slug: "",
            description: "",
            active: true,
        });

        setMainImage(null);

        setErrors({});

        if (mainRef.current)
            mainRef.current.value = "";
    };

    // SUBMIT

    const handleSubmit =
        async (e) => {

            e.preventDefault();

            if (!validate()) return;

            const formData =
                new FormData();

            Object.entries(collection)
                .forEach(([key, value]) => {

                    formData.append(
                        key,
                        value ?? ""
                    );

                });

            // IMAGE

            formData.append(
                "image",
                mainImage
            );

            try {

                const res =
                await fetch(
                    "http://localhost:8080/api/gem-collections/admin/create",
                    {
                        method: "POST",
                        body: formData,
                        credentials: "include",
                    }
                );

                const data =
                    await res.json();


                alert(
                    "Collection Added ✅"
                );

                resetForm();
                navigate(
                    "/admin/dashboard"
                );
            } catch (err) {

                console.error(err);

                alert("Error ❌");

            }
        };

    return (

        <div className="bg-gray-100 min-h-screen p-6">

            <h1 className="text-2xl font-semibold mb-6">
                Add Collection
            </h1>

            <form
                onSubmit={handleSubmit}
                className="
          grid
          grid-cols-1
          lg:grid-cols-3
          gap-6
        "
            >

                {/* LEFT */}

                <div className="lg:col-span-2 space-y-6">

                    {/* COLLECTION INFO */}

                    <div className="bg-white p-6 rounded-xl shadow">

                        <h2 className="text-lg font-semibold mb-2">
                            Collection Information
                        </h2>

                        <p className="text-gray-400 mb-2">
                            Add premium gemstone
                            collection details.
                        </p>

                        {/* NAME */}

                        <input
                            name="name"
                            placeholder="Collection Name"
                            value={collection.name}
                            onChange={handleChange}
                            className="
                w-full
                border
                border-gray-400
                outline-none
                p-2
                rounded-md
                mb-2
              "
                        />

                        <p className="text-red-500 text-sm">
                            {errors.name}
                        </p>

                        {/* SLUG */}

                        <input
                            name="slug"
                            placeholder="collection-slug"
                            value={collection.slug}
                            onChange={handleChange}
                            className="
                w-full
                border
                border-gray-400
                outline-none
                p-2
                rounded-md
                mt-3
                mb-2
              "
                        />

                        <p className="text-red-500 text-sm">
                            {errors.slug}
                        </p>

                        {/* DESCRIPTION */}

                        <textarea
                            name="description"
                            placeholder="Description"
                            value={
                                collection.description
                            }
                            onChange={handleChange}
                            rows={5}
                            className="
                w-full
                border
                border-gray-400
                mt-3
                mb-2
                p-2
                rounded-md
                outline-none
              "
                        />

                        <p className="text-red-500 text-sm">
                            {errors.description}
                        </p>

                    </div>

                    {/* MAIN IMAGE */}

                    <div className="bg-white p-6 rounded-xl shadow">

                        <h2 className="font-semibold mb-2">
                            Collection Image
                        </h2>

                        <div
                            onClick={() =>
                                mainRef.current.click()
                            }
                            className="
                border-2
                border-dashed
                border-gray-400
                rounded-md
                outline-none
                p-10
                text-center
                cursor-pointer
              "
                        >

                            {mainImage ? (

                                <img
                                    src={URL.createObjectURL(
                                        mainImage
                                    )}
                                    className="
                    w-32
                    h-32
                    mx-auto
                    object-contain
                  "
                                />

                            ) : (
                                "Upload Collection Image"
                            )}

                            <input
                                type="file"
                                name="image"
                                ref={mainRef}
                                className="hidden"
                                accept="image/*"
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

                </div>

                {/* RIGHT */}

                <div className="space-y-6">

                    {/* STATUS */}

                    <div className="bg-white p-6 rounded-xl shadow">

                        <h2 className="text-lg font-semibold mb-2">
                            Collection Status
                        </h2>

                        <label className="flex gap-2">

                            <input
                                type="checkbox"
                                name="active"
                                checked={
                                    collection.active
                                }
                                onChange={handleChange}
                            />

                            Active Collection

                        </label>

                    </div>

                </div>

            </form>

            {/* BUTTONS */}

            <div className="flex justify-end gap-3 mt-6">

                <button
                    type="button"
                    onClick={resetForm}
                    className="
            bg-red-400
            text-white
            px-5
            py-2
            rounded
          "
                >
                    Discard
                </button>

                <button
                    onClick={handleSubmit}
                    className="
            bg-green-600
            text-white
            px-6
            py-2
            rounded
          "
                >
                    Publish
                </button>

            </div>

        </div>
    );
};

export default AddCollection;
