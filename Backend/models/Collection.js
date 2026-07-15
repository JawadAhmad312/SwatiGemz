import mongoose from "mongoose";
import slugify from "slugify";

const collectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    image: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);
collectionSchema.pre("validate", function () {

  if (this.name) {

    this.slug = slugify(
      this.name,
      {
        lower: true,
        strict: true,
      }
    );
  }


});

const Collection = mongoose.model(
  "Collection",
  collectionSchema
);

export default Collection;