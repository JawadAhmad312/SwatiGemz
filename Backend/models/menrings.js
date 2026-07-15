import mongoose from "mongoose";

const Schema = mongoose.Schema;

const menringSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
      required: true,
      default: "",
    },

    category: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    images: {
      type: [String],
      default: [],
    },

    /* STOCK */
    stockquantity: {
      type: Number,
      required: true,
      default: 0,
    },

    /* SOLD OUT */
    soldOut: {
      type: Boolean,
      default: false,
    },

    stoneWeight: {
      type: Number,
      required: true,
    },

    ringSize: {
      type: Number,
      required: true,
    },

    metal: {
      type: String,
    },

    weightUnit: {
      type: String,
      enum: ["crt", "gram", "ratti"],
      default: "crt",
    },

    /* OPTIONAL */
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

/* AUTO SOLD OUT */
menringSchema.pre("save", function () {

  this.soldOut =
    this.stockquantity <= 0;

  
});

const MenRing = mongoose.model(
  "MenRing",
  menringSchema
);

export default MenRing;