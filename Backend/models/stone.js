import mongoose from "mongoose";

const Schema = mongoose.Schema;

const stoneSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      required: true,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShj0KnHXFpgJu_26GeHPRwuW339U1QNLKUXQ&s",
    },

    images: {
      type: [String],
      required: true,
    },

    weight: {
      type: Number,
      required: true,
    },

    shape: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
      required: true,
      // Example: "Zircon", "Ruby", "Blue Sapphire"
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

    description: {
      type: String,
      default:
        "SwatiGemz presents a premium-quality gemstone with exceptional shine, fine craftsmanship, and natural charm. Crafted to elevate your jewelry collection, it offers lasting beauty and elegance for both modern and classic styles.",
    },
  },
  { timestamps: true }
);

/* AUTO SOLD OUT */
stoneSchema.pre("save", function () {

  this.soldOut =
    this.stockquantity <= 0;

 
});

const Stone = mongoose.model(
  "Stone",
  stoneSchema
);

export default Stone;