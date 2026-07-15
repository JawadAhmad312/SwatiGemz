import React, {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import { FiTrash2 } from "react-icons/fi";

function EditMenCategory() {

    const { id } = useParams();

    const navigate = useNavigate();

    const refs = {

        title: useRef(),

        description: useRef(),

        price: useRef(),

        stockquantity: useRef(),
    };

    const [errors, setErrors] =
        useState({});

    const [loading, setLoading] =
        useState(false);

    const [oldImages,
        setOldImages
    ] = useState([]);

    const [files,
        setFiles
    ] = useState([]);

    const [mainImageFile,
        setMainImageFile
    ] = useState(null);

    const [category,
        setCategory
    ] = useState({

        title: "",

        price: "",

        description: "",

        stockquantity: "",

        soldOut: false,

        mainimages: "",

        details: {

            stoneWeight: "",

            ringSize: "",

            usSize: "",

            circumference: "",

            diameter: "",

            metal: "",

            productCode: "",

            polish: "",
        },
    });

    /* FETCH */

    useEffect(() => {

        fetch(
            `http://localhost:8080/api/men/${id}`
        )

            .then((res) => res.json())

            .then((data) => {

                setCategory({

                    title:
                        data.title || "",

                    price:
                        data.price || "",

                    description:
                        data.description || "",

                    stockquantity:
                        data.stockquantity || "",

                    soldOut:
                        data.soldOut || false,

                    mainimages:
                        data.mainimages || "",

                    details: {

                        stoneWeight:
                            data.details?.stoneWeight || "",

                        ringSize:
                            data.details?.ringSize || "",

                        usSize:
                            data.details?.usSize || "",

                        circumference:
                            data.details?.circumference || "",

                        diameter:
                            data.details?.diameter || "",

                        metal:
                            data.details?.metal || "",

                        productCode:
                            data.details?.productCode || "",

                        polish:
                            data.details?.polish || "",
                    },
                });

                setOldImages(
                    data.otherImages || []
                );
            });

    }, [id]);

    /* CHANGE */

    const handleChange =
        (e) => {

            const {
                name,
                value,
            } = e.target;

            setCategory((prev) => ({

                ...prev,

                [name]:
                    value,
            }));
        };

    /* DETAILS */

    const handleDetailsChange =
        (e) => {

            const {
                name,
                value,
            } = e.target;

            setCategory((prev) => ({

                ...prev,

                details: {

                    ...prev.details,

                    [name]:
                        value,
                },
            }));
        };

    /* ADD FILES */

    const handleFiles =
        (e) => {

            setFiles([

                ...files,

                ...Array.from(
                    e.target.files
                ),
            ]);
        };

    /* REMOVE OLD IMAGE */

    const removeOldImage =
        (index) => {

            const removed =
                oldImages[index];

            const updated =
                [...oldImages];

            updated.splice(index, 1);

            setOldImages(updated);

            /* REMOVE MAIN */

            if (
                removed ===
                category.mainimages
            ) {

                setCategory(prev => ({

                    ...prev,

                    mainimages: ""
                }));
            }
        };

    /* REMOVE NEW IMAGE */

    const removeNewImage =
        (index) => {

            const updated =
                [...files];

            updated.splice(index, 1);

            setFiles(updated);
        };

    /* VALIDATE */

    const validate = () => {

        let err = {};

        if (
            !category.title?.trim()
        ) {

            err.title =
                "Title required";
        }

        if (
            !category.description?.trim()
        ) {

            err.description =
                "Description required";
        }

        if (
            !category.price ||
            category.price <= 0
        ) {

            err.price =
                "Valid price required";
        }

        if (
            category.stockquantity < 0
        ) {

            err.stockquantity =
                "Invalid stock";
        }

        if (
            !category.mainimages &&
            !mainImageFile
        ) {

            err.mainimages =
                "Main image required";
        }

        setErrors(err);

        const firstError =
            Object.keys(err)[0];

        if (
            firstError &&
            refs[firstError]?.current
        ) {

            refs[
                firstError
            ].current.scrollIntoView({

                behavior:
                    "smooth",

                block:
                    "center",
            });

            refs[
                firstError
            ].current.focus();
        }

        return (
            Object.keys(err)
                .length === 0
        );
    };

    /* UPDATE */

    const handleUpdate =
        async () => {

            if (!validate())
                return;

            try {

                setLoading(true);

                const formData =
                    new FormData();

                formData.append(
                    "title",
                    category.title
                );

                formData.append(
                    "price",
                    category.price
                );

                formData.append(
                    "description",
                    category.description
                );

                formData.append(
                    "stockquantity",
                    category.stockquantity
                );

                formData.append(
                    "details",

                    JSON.stringify(
                        category.details
                    )
                );

                /* MAIN IMAGE */

                if (mainImageFile) {

                    formData.append(
                        "mainimages",
                        mainImageFile
                    );

                } else {

                    formData.append(
                        "mainimages",
                        category.mainimages || ""
                    );
                }

                /* OLD IMAGES */

                /* ALL EXISTING IMAGES */

                const existingAllImages = [

                    ...oldImages
                ];

                /* ADD CURRENT MAIN IMAGE */

                if (
                    category.mainimages
                ) {

                    existingAllImages.unshift(
                        category.mainimages
                    );
                }

                formData.append(

                    "existingImages",

                    JSON.stringify(
                        existingAllImages
                    )
                );

                /* NEW IMAGES */

                files.forEach((file) => {

                    formData.append(
                        "otherImages",
                        file
                    );
                });

                const res =
                    await fetch(

                        `http://localhost:8080/api/men/${id}`,

                        {

                            method:
                                "PUT",

                            body:
                                formData,
                            credentials: "include",
                        }
                    );

                const data =
                    await res.json();

                console.log(data);

                alert(
                    "Updated Successfully ✅"
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

    const inputClass =
        (field) =>

            `w-full border p-2 rounded mt-1 outline-none ${errors[field]

                ? "border-red-500"

                : "border-gray-300"
            }`;

    return (

        <div className="
      p-6
      bg-gray-100
      min-h-screen
    ">

            <h1 className="
        text-2xl
        font-bold
        mb-6
      ">
                Edit Men Category
            </h1>

            <div className="
        grid
        grid-cols-1
        lg:grid-cols-3
        gap-6
      ">

                {/* LEFT */}

                <div className="
          lg:col-span-2
          space-y-6
        ">

                    {/* PRODUCT */}

                    <div className="
            bg-white
            p-6
            rounded-xl
            shadow
          ">

                        <label>
                            Product Title
                        </label>

                        <input
                            ref={refs.title}
                            name="title"
                            value={category.title}
                            onChange={handleChange}
                            className={inputClass("title")}
                        />

                        <label className="
              block
              mt-4
            ">
                            Description
                        </label>

                        <textarea
                            rows={5}
                            ref={refs.description}
                            name="description"
                            value={category.description}
                            onChange={handleChange}
                            className={inputClass("description")}
                        />

                    </div>

                    {/* MAIN IMAGE */}

                    <div className="
            bg-white
            p-6
            rounded-xl
            shadow
          ">

                        <h3 className="
              font-semibold
              mb-3
              text-gray-500
            ">

                            Main Image

                        </h3>

                        <div className="
              flex
              items-center
              gap-4
              flex-wrap
            ">

                            {(category.mainimages ||
                                mainImageFile) && (

                                    <div className="
                  relative
                  w-fit
                ">

                                        <img
                                            src={
                                                mainImageFile

                                                    ? URL.createObjectURL(
                                                        mainImageFile
                                                    )

                                                    : category.mainimages
                                            }

                                            className="
                      w-28
                      h-28
                      object-cover
                      rounded-lg
                      border
                    "
                                        />

                                        <button
                                            type="button"

                                            onClick={() => {

                                                /* REMOVE MAIN FROM OLD IMAGES */

                                                const updatedImages =

                                                    oldImages.filter(

                                                        (img) =>

                                                            img !== category.mainimages
                                                    );

                                                setOldImages(
                                                    updatedImages
                                                );

                                                setMainImageFile(
                                                    null
                                                );

                                                setCategory(prev => ({

                                                    ...prev,

                                                    mainimages: ""
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

                                            <FiTrash2
                                                className="
                        text-red-500
                        text-sm
                      "
                                            />

                                        </button>

                                    </div>
                                )}

                            {!category.mainimages &&
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

                        </div>

                    </div>

                    {/* OTHER IMAGES */}

                    <div className="
            bg-white
            p-6
            rounded-xl
            shadow
          ">

                        <h3 className="
              font-semibold
              mb-3
              text-gray-500
            ">

                            Other Images

                        </h3>

                        {/* OLD */}

                        <div className="
              flex
              gap-3
              flex-wrap
              mb-4
            ">

                            {oldImages.map(
                                (img, i) => (

                                    <div
                                        key={i}
                                        className="
                      relative
                    "
                                    >

                                        <img
                                            src={img}
                                            className="
                        w-20
                        h-20
                        object-cover
                        rounded
                      "
                                        />

                                        <button
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
                                )
                            )}

                        </div>

                        {/* NEW */}

                        <div className="
              flex
              gap-3
              flex-wrap
              mb-4
            ">

                            {files.map(
                                (file, i) => (

                                    <div
                                        key={i}
                                        className="
                      relative
                    "
                                    >

                                        <img
                                            src={URL.createObjectURL(file)}
                                            className="
                        w-20
                        h-20
                        object-cover
                        rounded
                      "
                                        />

                                        <button
                                            onClick={() =>
                                                removeNewImage(i)
                                            }

                                            className="
                        absolute
                        top-0
                        right-0
                        bg-white
                        rounded-full
                        p-1
                      "
                                        >

                                            <FiTrash2 />

                                        </button>

                                    </div>
                                )
                            )}

                        </div>

                        {/* BUTTON */}

                        <div className="
              flex
              justify-center
            ">

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

                                hidden

                                onChange={handleFiles}
                            />

                        </div>

                    </div>

                </div>

                {/* RIGHT */}

                <div className="
          space-y-6
        ">

                    <div className="
            bg-white
            p-6
            rounded-xl
            shadow
          ">

                        <label>
                            Price
                        </label>

                        <input
                            ref={refs.price}
                            type="number"
                            name="price"
                            value={category.price}
                            onChange={handleChange}
                            className={inputClass("price")}
                        />

                    </div>

                    <div className="
            bg-white
            p-6
            rounded-xl
            shadow
          ">

                        <label>
                            Stock Quantity
                        </label>

                        <input
                            ref={refs.stockquantity}
                            type="number"
                            name="stockquantity"
                            value={
                                category.stockquantity
                            }
                            onChange={handleChange}
                            className={inputClass("stockquantity")}
                        />

                    </div>

                    {/* DETAILS */}

                    <div className="
            bg-white
            p-6
            rounded-xl
            shadow
            space-y-3
          ">

                        <h2 className="
              font-semibold
            ">
                            Details
                        </h2>

                        <input
                            name="stoneWeight"
                            placeholder="Stone Weight"
                            value={
                                category.details
                                    ?.stoneWeight
                            }
                            onChange={
                                handleDetailsChange
                            }
                            className="
                w-full
                border
                p-2
                rounded
              "
                        />

                        <input
                            name="ringSize"
                            placeholder="Ring Size"
                            value={
                                category.details
                                    ?.ringSize
                            }
                            onChange={
                                handleDetailsChange
                            }
                            className="
                w-full
                border
                p-2
                rounded
              "
                        />

                        <input
                            name="usSize"
                            placeholder="US Size"
                            value={
                                category.details
                                    ?.usSize
                            }
                            onChange={
                                handleDetailsChange
                            }
                            className="
                w-full
                border
                p-2
                rounded
              "
                        />

                        <input
                            name="circumference"
                            placeholder="Circumference"
                            value={
                                category.details
                                    ?.circumference
                            }
                            onChange={
                                handleDetailsChange
                            }
                            className="
                w-full
                border
                p-2
                rounded
              "
                        />

                        <input
                            name="diameter"
                            placeholder="Diameter"
                            value={
                                category.details
                                    ?.diameter
                            }
                            onChange={
                                handleDetailsChange
                            }
                            className="
                w-full
                border
                p-2
                rounded
              "
                        />

                        <input
                            name="metal"
                            placeholder="Metal"
                            value={
                                category.details
                                    ?.metal
                            }
                            onChange={
                                handleDetailsChange
                            }
                            className="
                w-full
                border
                p-2
                rounded
              "
                        />

                        <input
                            name="productCode"
                            placeholder="Product Code"
                            value={
                                category.details
                                    ?.productCode
                            }
                            onChange={
                                handleDetailsChange
                            }
                            className="
                w-full
                border
                p-2
                rounded
              "
                        />

                        <input
                            name="polish"
                            placeholder="Polish"
                            value={
                                category.details
                                    ?.polish
                            }
                            onChange={
                                handleDetailsChange
                            }
                            className="
                w-full
                border
                p-2
                rounded
              "
                        />

                    </div>

                </div>

            </div>

            {/* ACTIONS */}

            <div className="
        flex
        justify-end
        gap-3
        mt-6
      ">

                <button
                    onClick={() =>
                        navigate(
                            "/admin/dashboard/mencategory"
                        )
                    }

                    className="
            bg-red-500
            text-white
            px-5
            py-2
            rounded
          "
                >

                    Cancel

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
                        : "Update Category"}

                </button>

            </div>

        </div>
    );
}

export default EditMenCategory;
