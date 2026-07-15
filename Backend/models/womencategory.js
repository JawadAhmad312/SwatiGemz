import mongoose from "mongoose";

const Schema = mongoose.Schema;

const WomencategorySchema = new Schema({

  title: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  mainimages: {
    type: String,
    required: true,
  },

  otherImages: {
    type: [String],
    required: true,
  },

  details: {
    stoneWeight: String,
    ringSize: Number,
    usSize: Number,
    circumference: Number,
    diameter: String,
    metal: String,
    productCode: String,
    polish: String,
  },

  description: {
    type: String,
    required: true,
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

}, { timestamps: true });

/* AUTO SOLD OUT */
WomencategorySchema.pre("save", function () {

  this.soldOut =
    this.stockquantity <= 0;

  
});

const WomenCategory = mongoose.model(
  "WomenCategory",
  WomencategorySchema
);

export default WomenCategory;