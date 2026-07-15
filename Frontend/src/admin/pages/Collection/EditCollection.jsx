import {
    useEffect,
    useState,
    useRef,
} from "react";

import axios from "axios";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

const EditCollection = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const imageRef = useRef();

    const [loading, setLoading] =
        useState(false);

    const [mainImage, setMainImage] =
        useState(null);

    const [formData, setFormData] =
        useState({
            name: "",
            slug: "",
            image: "",
            description: "",
            active: true,
        });

    // FETCH COLLECTION

    useEffect(() => {
        fetchCollection();
    }, []);

    const fetchCollection =
        async () => {

            try {

                const res =
                    await axios.get(
                        `http://localhost:8080/api/gem-collections/admin/${id}`
                    );

                setFormData(
                    res.data.collection
                );

            } catch (err) {

                console.log(err);

            }
        };

    // HANDLE CHANGE

    const handleChange = (e) => {

        const {
            name,
            value,
            type,
            checked,
        } = e.target;

        let updatedData = {
            ...formData,

            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        };

        // AUTO SLUG

        if (name === "name") {

            updatedData.slug = value
                .toLowerCase()
                .trim()
                .split(" ")
                .slice(0, 2)
                .join("-")
                .replace(
                    /[^\w-]+/g,
                    ""
                );
        }

        setFormData(updatedData);
    };

    // IMAGE CHANGE

    const handleImageChange =
        (e) => {

            setMainImage(
                e.target.files[0]
            );
        };

    // UPDATE

    const handleSubmit =
        async (e) => {

            e.preventDefault();

            try {

                setLoading(true);

                const submitData =
                    new FormData();

                submitData.append(
                    "name",
                    formData.name
                );

                submitData.append(
                    "description",
                    formData.description
                );

                submitData.append(
                    "active",
                    formData.active
                );

                // NEW IMAGE

                if (mainImage) {

                    submitData.append(
                        "image",
                        mainImage
                    );
                }

                const res =
                    await fetch(
                        `http://localhost:8080/api/gem-collections/admin/update/${id}`,
                        {
                            method: "PUT",
                            body: submitData,
                            credentials: "include",
                        }
                    );

                const data =
                    await res.json();

                console.log(data);

                alert(
                    "Collection Updated ✅"
                );

                navigate(
                    "/admin/dashboard"
                );

            } catch (err) {

                console.log(err);

            } finally {

                setLoading(false);

            }
        };

    return (

        <div className="bg-gray-100 min-h-screen p-6">

            <h1 className="text-2xl font-semibold mb-6">
                Edit Collection
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
                            Update collection
                            details.
                        </p>

                        {/* NAME */}

                        <input
                            name="name"
                            placeholder="Collection Name"
                            value={formData.name}
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

                        {/* SLUG */}

                        <input
                            name="slug"
                            value={formData.slug}
                            readOnly
                            className="
                w-full
                border
                border-gray-400
                outline-none
                p-2
                rounded-md
                mt-3
                mb-2
                bg-gray-100
              "
                        />

                        {/* DESCRIPTION */}

                        <textarea
                            name="description"
                            placeholder="Description"
                            value={
                                formData.description
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

                    </div>

                    {/* IMAGE */}

                    <div className="bg-white p-6 rounded-xl shadow">

                        <h2 className="font-semibold mb-4">
                            Collection Image
                        </h2>

                        {/* OLD IMAGE */}

                        <div className="mb-4">

                            <img
                                src={
                                    mainImage
                                        ? URL.createObjectURL(
                                            mainImage
                                        )
                                        : formData.image
                                }
                                alt="collection"
                                className="
                  w-40
                  h-40
                  object-contain
                  border
                  rounded-xl
                  p-2
                "
                            />

                        </div>

                        {/* UPLOAD */}

                        <div
                            onClick={() =>
                                imageRef.current.click()
                            }
                            className="
                border-2
                border-dashed
                border-gray-400
                rounded-md
                outline-none
                p-6
                text-center
                cursor-pointer
              "
                        >

                            Upload New Image

                            <input
                                type="file"
                                ref={imageRef}
                                className="hidden"
                                accept="image/*"
                                onChange={
                                    handleImageChange
                                }
                            />

                        </div>

                    </div>

                </div>

                {/* RIGHT */}

                <div className="space-y-6">

                    {/* STATUS */}

                    <div className="bg-white p-6 rounded-xl shadow">

                        <h2 className="text-lg font-semibold mb-3">
                            Collection Status
                        </h2>

                        <label className="flex gap-2">

                            <input
                                type="checkbox"
                                name="active"
                                checked={
                                    formData.active
                                }
                                onChange={
                                    handleChange
                                }
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
                    onClick={() =>
                        navigate(
                            "/admin/dashboard"
                        )
                    }
                    className="
            bg-red-400
            text-white
            px-5
            py-2
            rounded
          "
                >
                    Cancel
                </button>

                <button
                    onClick={handleSubmit}
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
                        : "Update Collection"}

                </button>

            </div>

        </div>
    );
};

export default EditCollection;
