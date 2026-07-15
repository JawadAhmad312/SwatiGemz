import mongoose from "mongoose";

const Schema = mongoose.Schema;

const necklacesSchema = new Schema(
  {
    /* BASIC INFO */
    name: {
      type: String,
      required: true,
    },

    brand: {
      type: String,
      default: "SwatiGemz",
    },

    price: {
      type: Number,
      required: true,
    },

    /* IMAGES */
    image: {
      type: String,
      required: true,
    },

    images: {
      type: [String],
      default: [],
    },

    /* DETAILS SECTION */
    stoneWeight: {
      type: Number,
      required: true,
    },

    weightUnit: {
      type: String,
      enum: ["crt", "gram", "ratti"],
      default: "crt",
    },

    beadSize: {
      type: String,
    },

    /* DESCRIPTION */
    description: {
      type: String,
      required: true,
    },

    note: {
      type: String,
      default:
        "Actual product color may vary slightly from the image.",
    },

    /* STOCK */
    stockquantity: {
      type: Number,
      default: 0,
    },

    /* SOLD OUT */
    soldOut: {
      type: Boolean,
      default: false,
    },

    /* CATEGORY */
    category: {
      type: String,
      required: true,
    },

    /* OPTIONAL FLAGS */
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

/* AUTO SOLD OUT */
necklacesSchema.pre("save", function () {

  this.soldOut =
    this.stockquantity <= 0;
});

const Necklaces = mongoose.model(
  "Necklaces",
  necklacesSchema
);

export default Necklaces;