import {
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiTrash2 } from "react-icons/fi";
import slugify from "slugify";

function AddGemstone() {

  // PRODUCT STATE
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); 
  const [gemstone, setGemstone] =
    useState({

      name: "",

      slug: "",

      productCode:
        "GM-" +
        Math.floor(
          100000 +
          Math.random() *
          900000
        ),

      gemCollection: "",

      weight: "",

      shape: "Round",

      category: "",

      price: "",

      stockquantity: "",

      featured: false,

      shortDescription: "",

      description: "",

      metaTitle: "",

      metaDescription: "",

      active: true,
    });

  // COLLECTIONS

  const [collections, setCollections] =
    useState([]);

  // IMAGES

  const [mainImage, setMainImage] =
    useState(null);

  const [files, setFiles] =
    useState([]);

  // ERRORS

  const [errors, setErrors] =
    useState({});

  // REFS

  const inputRef = useRef();

  const mainRef = useRef();

  // FETCH COLLECTIONS

  useEffect(() => {

    fetchCollections();

  }, []);

  const fetchCollections =
    async () => {

      try {

        const res =
          await axios.get(
            "http://localhost:8080/api/gem-collections"
          );

        setCollections(
          res.data.collections
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

    // AUTO SLUG
    if (name === "name") {

      const generatedSlug =
        slugify(value, {
          lower: true,
          strict: true,
        })
          .split("-")
          .slice(0, 3)
          .join("-");

      setGemstone((prev) => ({

        ...prev,

        name: value,

        slug:
          generatedSlug,
      }));

      return;
    }

    setGemstone((prev) => ({

      ...prev,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // FILE HANDLING

  const handleFiles =
    (selectedFiles) => {

      setFiles((prev) => [

        ...prev,

        ...Array.from(
          selectedFiles
        ),
      ]);
    };

  const removeFile =
    (index) => {

      const updated =
        [...files];

      updated.splice(
        index,
        1
      );

      setFiles(updated);
    };

  // VALIDATION

  const validate = () => {

    let err = {};

    if (!gemstone.name)
      err.name =
        "Name required";

    if (!gemstone.price)
      err.price =
        "Price required";

    if (!gemstone.weight)
      err.weight =
        "Weight required";

    if (!gemstone.category)
      err.category =
        "Category required";

    if (
      !gemstone.stockquantity
    )
      err.stockquantity =
        "Stock required";

    if (
      !gemstone.description
    )
      err.description =
        "Description required";

    if (!mainImage)
      err.image =
        "Main image required";

    if (
      !gemstone.gemCollection
    )
      err.gemCollection =
        "Collection required";

    setErrors(err);

    return (
      Object.keys(err)
        .length === 0
    );
  };

  // RESET

  const resetForm = () => {

    setGemstone({

      name: "",

      slug: "",

      productCode:
        "GM-" +
        Math.floor(
          100000 +
          Math.random() *
          900000
        ),

      gemCollection: "",

      weight: "",

      shape: "Round",

      category: "",

      price: "",

      stockquantity: "",

      featured: false,

      shortDescription: "",

      description: "",

      metaTitle: "",

      metaDescription: "",

      active: true,
    });

    setMainImage(null);

    setFiles([]);

    setErrors({});

    if (inputRef.current)
      inputRef.current.value =
        "";

    if (mainRef.current)
      mainRef.current.value =
        "";
  };

  // SUBMIT

  const handleSubmit =
    async (e) => {

      e.preventDefault();
setLoading(true);
      if (!validate())
        return;

      const formData =
        new FormData();

      Object.entries(
        gemstone
      ).forEach(
        ([key, value]) => {

          formData.append(
            key,
            value ?? ""
          );
        }
      );

      // MAIN IMAGE

      formData.append(
        "image",
        mainImage
      );

      // EXTRA IMAGES

      files.forEach(
        (file) => {

          formData.append(
            "images",
            file
          );
        }
      );

      try {

        const res =
          await fetch(
            "http://localhost:8080/api/gemstones",
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
          "Gemstone Added ✅"

        );
        navigate("/admin/dashboard");
        resetForm();

      } catch (err) {

        console.error(err);

        alert(
          "Error ❌"
        );
      }
    };

  return (

    <div className="bg-gray-100 min-h-screen p-6">

      <h1 className="text-2xl font-semibold mb-6">
        Add Gemstone
      </h1>

      <form
        onSubmit={
          handleSubmit
        }
        className="
          grid
          grid-cols-1
          lg:grid-cols-3
          gap-6
        "
      >

        {/* LEFT */}

        <div className="lg:col-span-2 space-y-6">

          {/* PRODUCT INFO */}

          <div className="bg-white p-6 rounded-xl shadow">

            <h2 className="text-lg font-semibold mb-2">
              Product Information
            </h2>

            <p className="text-gray-400 mb-4">
              Add gemstone
              details below.
            </p>

            {/* NAME */}

            <input
              name="name"
              placeholder="Gemstone Name"
              value={
                gemstone.name
              }
              onChange={
                handleChange
              }
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
              value={
                gemstone.slug
              }
              readOnly
              placeholder="Slug"
              className="
                w-full
                border
                border-gray-400
                outline-none
                p-2
                rounded-md
                mb-2
                bg-gray-100
              "
            />

            {/* PRODUCT CODE */}

            <input
              value={
                gemstone.productCode
              }
              readOnly
              className="
                w-full
                border
                border-gray-400
                outline-none
                p-2
                rounded-md
                mb-2
                bg-gray-100
              "
            />

            {/* COLLECTION */}

            <select
              name="gemCollection"
              value={
                gemstone.gemCollection
              }
              onChange={
                handleChange
              }
              className="
                w-full
                border
                border-gray-400
                outline-none
                p-2
                rounded-md
                mb-2
              "
            >

              <option value="">
                Select Collection
              </option>

              {collections.map(
                (
                  item
                ) => (

                  <option
                    key={
                      item._id
                    }
                    value={
                      item._id
                    }
                  >
                    {item.name}
                  </option>
                )
              )}

            </select>

            <p className="text-red-500 text-sm">
              {
                errors.gemCollection
              }
            </p>

            {/* DESCRIPTION */}

            <textarea
              name="description"
              placeholder="Description"
              value={
                gemstone.description
              }
              onChange={
                handleChange
              }
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
              {
                errors.description
              }
            </p>

            {/* SHORT DESCRIPTION */}

            <textarea
              name="shortDescription"
              placeholder="Short Description"
              value={
                gemstone.shortDescription
              }
              onChange={
                handleChange
              }
              rows={3}
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

          {/* MAIN IMAGE */}

          <div className="bg-white p-6 rounded-xl shadow">

            <h2 className="font-semibold mb-2">
              Main Image
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
                    w-24
                    h-24
                    mx-auto
                  "
                />

              ) : (
                "Upload Main Image"
              )}

              <input
                type="file"
                ref={mainRef}
                className="hidden"
                onChange={(e) =>
                  setMainImage(
                    e.target
                      .files[0]
                  )
                }
              />

            </div>

            <p className="text-red-500 mt-2 text-sm">
              {errors.image}
            </p>

          </div>

          {/* OTHER IMAGES */}

          <div className="bg-white p-6 rounded-xl shadow">

            <h2 className="font-semibold mb-2">
              Other Images
            </h2>

            <div
              onClick={() =>
                inputRef.current.click()
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

              Upload Images

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

            {/* PREVIEW */}

            <div className="flex flex-wrap gap-3 mt-3">

              {files.map(
                (
                  file,
                  i
                ) => (

                  <div
                    key={i}
                    className="relative"
                  >

                    <img
                      src={URL.createObjectURL(
                        file
                      )}
                      className="
                        w-20
                        h-20
                        object-cover
                      "
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeFile(
                          i
                        )
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
                                        text-md
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

          {/* PRICING */}

          <div className="bg-white p-6 rounded-xl shadow">

            <h2 className="text-lg font-semibold">
              Pricing
            </h2>

            <input
              type="number"
              name="price"
              placeholder="Price"
              value={
                gemstone.price
              }
              onChange={
                handleChange
              }
              className="
                w-full
                border
                border-gray-400
                p-2
                rounded-md
                outline-none
              "
            />

            <p className="text-red-500 mt-2 text-sm">
              {errors.price}
            </p>

          </div>

          {/* INVENTORY */}

          <div className="bg-white p-6 rounded-xl shadow">

            <h2 className="text-lg font-semibold mb-1">
              Inventory
            </h2>

            <input
              type="number"
              name="stockquantity"
              placeholder="Stock Quantity"
              value={
                gemstone.stockquantity
              }
              onChange={
                handleChange
              }
              className="
                w-full
                border
                border-gray-400
                p-2
                rounded-md
                outline-none
              "
            />

            <p className="text-red-500 mt-2 text-sm">
              {
                errors.stockquantity
              }
            </p>

          </div>

          {/* DETAILS */}

          <div className="bg-white p-6 rounded-xl shadow">

            <h2 className="text-lg font-semibold mb-2">
              Details
            </h2>

            {/* WEIGHT */}

            <input
              type="number"
              name="weight"
              placeholder="Weight"
              value={
                gemstone.weight
              }
              onChange={
                handleChange
              }
              className="
                w-full
                border
                border-gray-400
                p-2
                rounded-md
                outline-none
                mb-2
              "
            />

            <p className="text-red-500 text-sm">
              {errors.weight}
            </p>

            {/* SHAPE */}

            <input
              name="shape"
              placeholder="Shape"
              value={
                gemstone.shape
              }
              onChange={
                handleChange
              }
              className="
                w-full
                border
                border-gray-400
                p-2
                rounded-md
                outline-none
                mb-2
              "
            />

            {/* CATEGORY */}

            <input
              name="category"
              placeholder="Category"
              value={
                gemstone.category
              }
              onChange={
                handleChange
              }
              className="
                w-full
                border
                border-gray-400
                p-2
                rounded-md
                outline-none
                mb-2
              "
            />

            <p className="text-red-500 text-sm">
              {
                errors.category
              }
            </p>

            {/* FEATURED */}

            <label className="flex gap-2 mb-2">

              <input
                type="checkbox"
                name="featured"
                checked={
                  gemstone.featured
                }
                onChange={
                  handleChange
                }
              />

              Featured Product

            </label>

            {/* ACTIVE */}

            <label className="flex gap-2">

              <input
                type="checkbox"
                name="active"
                checked={
                  gemstone.active
                }
                onChange={
                  handleChange
                }
              />

              Active Product

            </label>

          </div>

          {/* SEO */}

          <div className="bg-white p-6 rounded-xl shadow">

            <h2 className="text-lg font-semibold mb-2">
              SEO
            </h2>

            <input
              name="metaTitle"
              placeholder="Meta Title"
              value={
                gemstone.metaTitle
              }
              onChange={
                handleChange
              }
              className="
                w-full
                border
                border-gray-400
                p-2
                rounded-md
                outline-none
                mb-2
              "
            />

            <textarea
              rows={4}
              name="metaDescription"
              placeholder="Meta Description"
              value={
                gemstone.metaDescription
              }
              onChange={
                handleChange
              }
              className="
                w-full
                border
                border-gray-400
                p-2
                rounded-md
                outline-none
              "
            />

          </div>

        </div>

      </form>

      {/* BUTTONS */}

      <div className="flex justify-end gap-3 mt-6">

        <button
          type="button"
          onClick={
            resetForm
          }
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
          disabled={loading}
          className="bg-green-600 text-white px-6 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Publishing..." : "Publish"}
        </button>

      </div>

    </div>
  );
}

export default AddGemstone;
