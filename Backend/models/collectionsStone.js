import mongoose from "mongoose";
const Schema = mongoose.Schema;

const collectionSchema = new Schema(
  {
    image: {
      type: String,
      required: true,
      default:
        "https://www.gemstore.pk/wp-content/uploads/2025/08/hgjh.webp",
    },

    // 🔥 SAME for all items in one category (Blue Sapphire)
    categoryTitle: {
      type: String,
      required: true,
      trim: true,
    },

    // 🔥 Used for routing & filtering (blue-sapphire)
    category: {
      type: String,
      required: true,
      index: true,
    },

    // optional: stone weight / carat
    carat: {
      type: String,
      required: true
    },

    price: {
      type: Number,
      required: true,
    },

    saleprice: {
      type: Number,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    }, stock: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
  }
);



const Collection = mongoose.model(
  "Collection",
  collectionSchema
);

export default Collection;