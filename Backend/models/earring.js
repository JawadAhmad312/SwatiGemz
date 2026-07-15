import mongoose from "mongoose";

const Schema = mongoose.Schema;

const earringSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "PKR",
    },

    // MAIN IMAGE
    image: {
      type: String,
      required: true,
    },

    // MULTIPLE IMAGES
    images: [
      {
        type: String,
      },
    ],

    // PRODUCT CODE
    productCode: {
      type: String,
      unique: true,
    },

    stoneWeight: {
      type: String,
      default: "6 carat",
    },

    category: {
      type: String,
      default: "Earrings",
    },

    description: {
      type: String,
      default:
        "These stunning Ruby earrings feature a radiant ruby stone encircled by a halo of pure silver, creating an eye-catching look.",
    },

    metal: {
      type: String,
      default: "925 Silver",
    },

    // STOCK
    stockquantity: {
      type: Number,
      default: 10,
    },

    // SOLD OUT
    soldOut: {
      type: Boolean,
      default: false,
    },

    availability: {
      type: String,
      default: "Available on Order in 5-7 Days",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// AUTO SOLD OUT + PRODUCT CODE
earringSchema.pre("save", function () {

  // Auto product code
  if (!this.productCode) {
    this.productCode =
      "GM-" +
      Math.floor(100000 + Math.random() * 900000);
  }

  // Auto sold out
  this.soldOut = this.stockquantity <= 0;

 
});

const Earring = mongoose.model(
  "Earring",
  earringSchema
);

export default Earring;