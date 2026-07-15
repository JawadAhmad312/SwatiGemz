import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiTrash2 } from "react-icons/fi";

function EditWomenCategory() {

  const { id } = useParams();

  const navigate = useNavigate();

  const refs = {

    title: useRef(),

    description: useRef(),

    price: useRef(),

    stockquantity: useRef()
  };

  const [loading, setLoading] =
    useState(false);

  const [errors, setErrors] =
    useState({});

  /* MAIN IMAGE */

  const [mainImageFile, setMainImageFile] =
    useState(null);

  /* OTHER IMAGES */

  const [files, setFiles] =
    useState([]);

  /* OLD OTHER IMAGES */

  const [oldImages, setOldImages] =
    useState([]);

  /* FORM */

  const [form, setForm] =
    useState({

      title: "",

      price: "",

      description: "",

      stockquantity: "",

      mainimages: "",

      details: {

        stoneWeight: "",

        ringSize: "",

        usSize: "",

        circumference: "",

        diameter: "",

        metal: "",

        productCode: "",

        polish: ""
      }
    });

  /* FETCH */

  useEffect(() => {

    fetch(

      `http://localhost:8080/api/women/${id}`

    )

      .then(res => res.json())

      .then(data => {

        setForm({

          title:
            data.title || "",

          price:
            data.price || "",

          description:
            data.description || "",

          stockquantity:
            data.stockquantity || "",

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
              data.details?.polish || ""
          }
        });

        /* OLD OTHER IMAGES */

        const filteredImages =

          (data.otherImages || []).filter(

            img =>

              img &&

              img !== data.mainimages
          );

        setOldImages(filteredImages);
      });

  }, [id]);

  /* CHANGE */

  const handleChange = (e) => {

    const {

      name,

      value

    } = e.target;

    setForm(prev => ({

      ...prev,

      [name]: value
    }));
  };

  /* DETAILS */

  const handleDetailsChange = (e) => {

    const {

      name,

      value

    } = e.target;

    setForm(prev => ({

      ...prev,

      details: {

        ...prev.details,

        [name]: value
      }
    }));
  };

  /* REMOVE OLD IMAGE */

  const removeOldImage = (index) => {

    const updated =
      [...oldImages];

    updated.splice(index, 1);

    setOldImages(updated);
  };

  /* REMOVE NEW IMAGE */

  const removeNewImage = (index) => {

    const updated =
      [...files];

    updated.splice(index, 1);

    setFiles(updated);
  };

  /* VALIDATION */

  const validate = () => {

    let err = {};

    if (!form.title.trim())
      err.title = "Title Required";

    if (!form.description.trim())
      err.description = "Description Required";

    if (!form.price || form.price <= 0)
      err.price = "Valid Price Required";

    if (

      !form.mainimages &&

      !mainImageFile

    ) {

      err.mainimages =
        "Main Image Required";
    }

    setErrors(err);

    const firstError =
      Object.keys(err)[0];

    if (

      firstError &&

      refs[firstError]?.current

    ) {

      refs[firstError]
        .current
        .scrollIntoView({

          behavior: "smooth",

          block: "center"
        });

      refs[firstError]
        .current
        .focus();
    }

    return Object.keys(err).length === 0;
  };

  /* UPDATE */

  const handleUpdate = async (e) => {

    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {

      const formData =
        new FormData();

      formData.append(
        "title",
        form.title
      );

      formData.append(
        "price",
        form.price
      );

      formData.append(
        "description",
        form.description
      );

      formData.append(
        "stockquantity",
        form.stockquantity
      );

      formData.append(

        "details",

        JSON.stringify(
          form.details
        )
      );

      /* EXISTING OTHER IMAGES */

      formData.append(

        "existingImages",

        JSON.stringify(oldImages)
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

          form.mainimages || ""
        );
      }

      /* OTHER IMAGES */

      files.forEach(file => {

        formData.append(

          "otherImages",

          file
        );
      });

      const res =
        await fetch(

          `http://localhost:8080/api/women/${id}`,

          {

            method: "PUT",

            body: formData,
            credentials: "include"
          }
        );

      const data =
        await res.json();

      if (data.success) {

        alert(
          "Updated Successfully ✅"
        );

        navigate(
          "/admin/dashboard"
        );

      } else {

        console.log(data);

        alert(
          "Update Failed ❌"
        );
      }

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);
    }
  };

  const inputClass = (field) =>

    `w-full border p-3 rounded-xl outline-none ${

      errors[field]

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
        text-3xl
        font-bold
        mb-6
      ">

        Edit Women Category

      </h1>

      <form
        onSubmit={handleUpdate}
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

          {/* INFO */}

          <div className="
            bg-white
            p-6
            rounded-2xl
            shadow
          ">

            <h2 className="
              text-xl
              font-semibold
              mb-5
            ">

              Product Information

            </h2>

            {/* TITLE */}

            <div className="mb-4">

              <label className="
                text-sm
                font-medium
              ">

                Title

              </label>

              <input
                ref={refs.title}
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                className={inputClass("title")}
              />

            </div>

            {/* DESCRIPTION */}

            <div>

              <label className="
                text-sm
                font-medium
              ">

                Description

              </label>

              <textarea
                ref={refs.description}
                rows={5}
                name="description"
                value={form.description}
                onChange={handleChange}
                className={inputClass("description")}
              />

            </div>

          </div>

          {/* IMAGES */}

         

            <h2 className="
              text-xl
              font-semibold
            ">

              Product Images

            </h2>

            {/* MAIN IMAGE */}

            <div className="bg-white p-6 rounded-xl shadow">

              <h3 className="
                font-medium
                mb-4
                text-gray-600
              ">

                Main Image

              </h3>

              <div className="
                flex
                flex-wrap
                gap-4
              ">

                {/* OLD */}

                {form.mainimages &&
                  !mainImageFile && (

                  <div className="
                    relative
                  ">

                    <img
                      src={form.mainimages}
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

                        setForm(prev => ({

                          ...prev,

                          mainimages: ""
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

                      <FiTrash2 className="
                        text-red-500
                      " />

                    </button>

                  </div>
                )}

                {/* NEW */}

                {mainImageFile && (

                  <div className="
                    relative
                  ">

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

                      <FiTrash2 className="
                        text-red-500
                      " />

                    </button>

                  </div>
                )}

                {/* BUTTON */}

                {!form.mainimages &&
                  !mainImageFile && (

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

              <h3 className="
                font-medium
                mb-4
                text-gray-600
              ">

                Other Images

              </h3>

              <div className="
                flex
                flex-wrap
                gap-4
              ">

                {/* OLD */}

                {oldImages.map((img, i) => (

                  <div
                    key={i}
                    className="
                      relative
                    "
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

                      <FiTrash2 className="
                        text-red-500
                        text-sm
                      " />

                    </button>

                  </div>
                ))}

                {/* NEW */}

                {files.map((file, i) => (

                  <div
                    key={i}
                    className="
                      relative
                    "
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

                      onClick={() =>
                        removeNewImage(i)
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

                      <FiTrash2 className="
                        text-red-500
                        text-sm
                      " />

                    </button>

                  </div>
                ))}

                {/* BUTTON */}

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

          

        </div>

        {/* RIGHT */}

        <div className="
          space-y-6
        ">

          {/* PRICE */}

          <div className="
            bg-white
            p-6
            rounded-2xl
            shadow
          ">

            <label className="
              text-sm
              font-medium
            ">

              Price

            </label>

            <input
              ref={refs.price}
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className={inputClass("price")}
            />

          </div>

          {/* STOCK */}

          <div className="
            bg-white
            p-6
            rounded-2xl
            shadow
          ">

            <label className="
              text-sm
              font-medium
            ">

              Stock

            </label>

            <input
              ref={refs.stockquantity}
              type="number"
              name="stockquantity"
              value={form.stockquantity}
              onChange={handleChange}
              className={inputClass("stock")}
            />

          </div>

          {/* DETAILS */}

          <div className="
            bg-white
            p-6
            rounded-2xl
            shadow
            space-y-4
          ">

            <h2 className="
              text-lg
              font-semibold
            ">

              Product Details

            </h2>

            {Object.keys(form.details).map((key) => (

              <div key={key}>

                <label className="
                  text-sm
                  capitalize
                  font-medium
                ">

                  {key}

                </label>

                <input
                  type="text"
                  name={key}
                  value={form.details[key]}
                  onChange={handleDetailsChange}
                  className="
                    w-full
                    border
                    border-gray-300
                    p-3
                    rounded-xl
                    outline-none
                  "
                />

              </div>
            ))}

          </div>

        </div>

        {/* BUTTONS */}

        <div className="
          lg:col-span-3
          flex
          justify-end
          gap-3
        ">

          <button
            type="button"

            onClick={() =>
              navigate(
                "/admin/womencategory"
              )
            }

            className="
              px-6
              py-3
              rounded-xl
              bg-red-500
              text-white
            "
          >

            Cancel

          </button>

          <button
            type="submit"

            disabled={loading}

            className="
              px-6
              py-3
              rounded-xl
              bg-black
              text-white
            "
          >

            {loading

              ? "Updating..."

              : "Update Category"}

          </button>

        </div>

      </form>

    </div>
  );
}

export default EditWomenCategory;
