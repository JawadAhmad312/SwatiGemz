import mongoose from "mongoose";
const Schema = mongoose.Schema;
import slugify from "slugify";

const gemstoneSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    productCode: {
      type: String,
      unique: true,
    },
    gemCollection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection",
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
      default: "Round",
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    stockquantity: {
      type: Number,
      default: 0,
    },
    soldOut: {
      type: Boolean,
      default: false,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    shortDescription: {
      type: String,
      default:
        "Premium natural gemstone with exceptional brilliance.",
    },
    description: {
      type: String,

      default:
        "SwatiGemz presents a premium-quality gemstone with exceptional shine, fine craftsmanship, and natural charm. Crafted to elevate your jewelry collection, it offers lasting beauty and elegance for both modern and classic styles.",
    },



    // PRODUCT ACTIVE STATUS

    active: {
      type: Boolean,
      default: true,
    },



    // SEO TITLE

    metaTitle: {
      type: String,
      default: "",
    },



    // SEO DESCRIPTION

    metaDescription: {
      type: String,
      default: "",
    },

  },
  {
    timestamps: true,
  }
);




// AUTO SOLD OUT FUNCTIONALITY
gemstoneSchema.pre("validate", function () {

  // AUTO GENERATE SLUG
  if (this.name) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
    });
  }

  // AUTO PRODUCT CODE

  if (!this.productCode) {

    this.productCode =
      "GM-" +
      Math.floor(
        100000 + Math.random() * 900000
      );
  }
  // AUTO SOLD OUT
  this.soldOut = this.stockquantity <= 0;

});




const Gemstone = mongoose.model(
  "Gemstone",
  gemstoneSchema
);

export default Gemstone;