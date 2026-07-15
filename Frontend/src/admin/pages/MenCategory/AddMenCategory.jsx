import React, {
    useState,
    useRef,
} from "react";

import {
    useNavigate,
} from "react-router-dom";
import { FiTrash2 } from "react-icons/fi";



function AddMenCategory() {

    const navigate =
        useNavigate();

    const inputRef =
        useRef();

    /* STATES */

    const [category, setCategory] =
        useState({

            title: "",

            price: "",

            description: "",

            stockquantity: "",

            soldOut: false,

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

    const [mainImage, setMainImage] =
        useState(null);

    const [files, setFiles] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const [errors, setErrors] =
        useState({});

    /* HANDLE INPUT */

    const handleChange = (e) => {

        const {
            name,
            value,
            type,
            checked,
        } = e.target;

        setCategory({

            ...category,

            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        });
    };

    /* HANDLE DETAILS */

    const handleDetailsChange =
        (e) => {

            const {
                name,
                value,
            } = e.target;

            setCategory({

                ...category,

                details: {

                    ...category.details,

                    [name]: value,
                },
            });
        };

    /* FILES */

    const handleFiles =
        (selectedFiles) => {

            const newFiles =
                Array.from(selectedFiles);

            setFiles((prev) => [
                ...prev,
                ...newFiles,
            ]);
        };

    const handleDrop =
        (e) => {

            e.preventDefault();

            handleFiles(
                e.dataTransfer.files
            );
        };

    const removeFile =
        (index) => {

            const updated =
                [...files];

            updated.splice(index, 1);

            setFiles(updated);
        };

    /* VALIDATION */

    const validate = () => {

        let err = {};

        if (!category.title)
            err.title =
                "Title required";

        if (
            !category.price ||
            category.price <= 0
        )
            err.price =
                "Valid price required";

        if (!category.description)
            err.description =
                "Description required";

        if (!category.stockquantity)
            err.stockquantity =
                "Stock required";

        if (!mainImage)
            err.image =
                "Main image required";

        setErrors(err);

        return (
            Object.keys(err).length === 0
        );
    };

    /* RESET */

    const resetForm = () => {

        setCategory({

            title: "",

            price: "",

            description: "",

            stockquantity: "",

            soldOut: false,

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

        setMainImage(null);

        setFiles([]);
    };

    /* SUBMIT */

    const handleSubmit =
        async (e) => {

            e.preventDefault();

            if (!validate())
                return;

            setLoading(true);

            const formData =
                new FormData();

            formData.append(
                "title",
                category.title
            );

            formData.append(
                "price",
                Number(category.price)
            );

            formData.append(
                "description",
                category.description
            );

            formData.append(
                "stockquantity",
                Number(
                    category.stockquantity
                )
            );

            formData.append(
                "soldOut",
                category.stockquantity <= 0
            );

            /* DETAILS */

            formData.append(
                "details",
                JSON.stringify(
                    category.details
                )
            );

            /* MAIN IMAGE */

          if (mainImage) {

  formData.append(
    "mainimages",
    mainImage
  );
}

            /* OTHER IMAGES */

            files.forEach((file) => {

                formData.append(
                    "otherImages",
                    file
                );
            });

            try {

                const res =
                    await fetch(
                        "http://localhost:8080/api/men",
                        {
                            method: "POST",
                            body: formData,
                            credentials: "include",
                        }
                    );

                const data =
                    await res.json();

                console.log(data);

                alert(
                    "Men Category Added ✅"
                );

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

            <h1 className="text-2xl font-semibold mb-6">
                Add Men Category
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

                <div className="
          lg:col-span-2
          space-y-6
        ">

                    {/* PRODUCT INFO */}

                    <div className="
            bg-white
            p-6
            rounded-xl
            shadow
          ">

                        <h2 className="
              text-lg
              font-semibold
              mb-2
            ">
                            Product Information
                        </h2>

                        <input
                            name="title"
                            placeholder="Product Title"
                            value={category.title}
                            onChange={handleChange}
                            className="
                w-full
                border
                border-gray-400
                p-2
                rounded-md
                mt-3
                outline-none
              "
                        />

                        <p className="
              text-red-500
              mt-2
              text-sm
            ">
                            {errors.title}
                        </p>

                        <textarea
                            name="description"
                            placeholder="Description"
                            value={category.description}
                            onChange={handleChange}
                            rows={5}
                            className="
                w-full
                border
                rounded
                mt-3
                border-gray-400
                p-2
                outline-none
              "
                        />

                        <p className="
              text-red-500
              text-sm
            ">
                            {errors.description}
                        </p>

                    </div>

                    {/* MAIN IMAGE */}

                    {/* MAIN IMAGE */}

                    <div
                        className="
    bg-white
    p-6
    rounded-xl
    shadow
  "
                    >

                        <h2
                            className="
      text-lg
      font-semibold
      mb-4
    "
                        >
                            Main Image
                        </h2>

                        {/* SHOW IMAGE */}

                        {mainImage ? (

                            <div className="relative w-fit">

                                <img
                                    src={URL.createObjectURL(mainImage)}
                                    className="
          w-32
          h-32
          object-cover
          rounded-xl
          border
        "
                                />

                                {/* DELETE BUTTON */}

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

                        ) : (

                            /* UPLOAD BUTTON */

                            <div
                                onClick={() =>
                                    document
                                        .getElementById(
                                            "mainImageInput"
                                        )
                                        .click()
                                }
                                className="
        border-2
        border-dashed
        border-gray-300
        rounded-xl
        p-10
        text-center
        cursor-pointer
        hover:border-green-600
        transition
      "
                            >

                                <p className="text-gray-500">
                                    Click to Upload Main Image
                                </p>

                                <input
                                    id="mainImageInput"
                                    type="file"
                                    className="hidden"
                                    onChange={(e) =>
                                        setMainImage(
                                            e.target.files[0]
                                        )
                                    }
                                />

                            </div>

                        )}

                        <p
                            className="
      text-red-500
      text-sm
      mt-2
    "
                        >
                            {errors.image}
                        </p>

                    </div>
                    {/* OTHER IMAGES */}

                    <div className="
            bg-white
            p-6
            rounded-xl
            shadow
          ">

                        <h2 className="
              text-lg
              font-semibold
              mb-2
            ">
                            Other Images
                        </h2>

                        <div
                            onDragOver={(e) =>
                                e.preventDefault()
                            }
                            onDrop={handleDrop}
                            onClick={() =>
                                inputRef.current.click()
                            }
                            className="
                border-2
                border-dashed
                border-gray-300
                rounded-xl
                p-10
                text-center
                cursor-pointer
              "
                        >

                            Drop files here or click to upload

                            <input
                                type="file"
                                multiple
                                ref={inputRef}
                                className="hidden"
                                onChange={(e) =>
                                    handleFiles(
                                        e.target.files
                                    )
                                }
                            />

                        </div>

                     <div
  className="
    mt-4
    flex
    flex-wrap
    gap-4
  "
>

  {files.map(
    (file, index) => (

      <div
        key={index}
        className="
          relative
          w-[120px]
          h-[120px]
        "
      >

        <img
          src={URL.createObjectURL(file)}
          className="
            w-full
            h-full
            object-cover
            rounded-xl
            border
            shadow-sm
          "
        />

        {/* DELETE BUTTON */}

        <button
          type="button"
          onClick={() =>
            removeFile(index)
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
    )
  )}

</div>
                    </div>

                </div>

                {/* RIGHT */}

                <div className="space-y-6">

                    {/* PRICE */}

                    <div className="
            bg-white
            p-6
            rounded-xl
            shadow
          ">

                        <h2 className="
              text-lg
              font-semibold
              mb-2
            ">
                            Pricing
                        </h2>

                        <input
                            type="number"
                            name="price"
                            placeholder="Price"
                            value={category.price}
                            onChange={handleChange}
                            className="
                w-full
                border
                border-gray-400
                outline-none
                p-2
                rounded-lg
              "
                        />

                        <p className="
              text-red-500
              text-sm
              mt-2
            ">
                            {errors.price}
                        </p>

                    </div>

                    {/* INVENTORY */}

                    <div className="
            bg-white
            p-6
            rounded-xl
            shadow
          ">

                        <h2 className="
              text-lg
              font-semibold
              mb-2
            ">
                            Inventory
                        </h2>

                        <input
                            type="number"
                            name="stockquantity"
                            placeholder="Stock Quantity"
                            value={
                                category.stockquantity
                            }
                            onChange={handleChange}
                            className="
                w-full
                border
                border-gray-400
                outline-none
                rounded-lg
                p-2
              "
                        />

                        <p className="
              text-red-500
              text-sm
              mt-2
            ">
                            {errors.stockquantity}
                        </p>

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
              text-lg
              font-semibold
              mb-2
            ">
                            Details
                        </h2>

                        <input
                            name="stoneWeight"
                            placeholder="Stone Weight"
                            value={
                                category.details
                                    .stoneWeight
                            }
                            onChange={
                                handleDetailsChange
                            }
                            className="
                w-full
                border
                p-2
                rounded-lg
                outline-none
                border-gray-400
              "
                        />

                        <input
                            name="ringSize"
                            placeholder="Ring Size"
                            value={
                                category.details
                                    .ringSize
                            }
                            onChange={
                                handleDetailsChange
                            }
                            className="
                w-full
                border
                p-2
                rounded-lg
                outline-none
                border-gray-400
              "
                        />

                        <input
                            name="usSize"
                            placeholder="US Size"
                            value={
                                category.details
                                    .usSize
                            }
                            onChange={
                                handleDetailsChange
                            }
                            className="
                w-full
                border
                p-2
                rounded-lg
                outline-none
                border-gray-400
              "
                        />

                        <input
                            name="circumference"
                            placeholder="Circumference"
                            value={
                                category.details
                                    .circumference
                            }
                            onChange={
                                handleDetailsChange
                            }
                            className="
                w-full
                border
                p-2
                rounded-lg
                outline-none
                border-gray-400
              "
                        />

                        <input
                            name="diameter"
                            placeholder="Diameter"
                            value={
                                category.details
                                    .diameter
                            }
                            onChange={
                                handleDetailsChange
                            }
                            className="
                w-full
                border
                p-2
                rounded-lg
                outline-none
                border-gray-400
              "
                        />

                        <input
                            name="metal"
                            placeholder="Metal"
                            value={
                                category.details
                                    .metal
                            }
                            onChange={
                                handleDetailsChange
                            }
                            className="
                w-full
                border
                p-2
                rounded-lg
                outline-none
                border-gray-400
              "
                        />

                        <input
                            name="productCode"
                            placeholder="Product Code"
                            value={
                                category.details
                                    .productCode
                            }
                            onChange={
                                handleDetailsChange
                            }
                            className="
                w-full
                border
                p-2
                rounded-lg
                outline-none
                border-gray-400
              "
                        />

                        <input
                            name="polish"
                            placeholder="Polish"
                            value={
                                category.details
                                    .polish
                            }
                            onChange={
                                handleDetailsChange
                            }
                            className="
                w-full
                border
                p-2
                rounded-lg
                outline-none
                border-gray-400
              "
                        />

                    </div>

                </div>

            </form>

            {/* BUTTONS */}

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

export default AddMenCategory;
