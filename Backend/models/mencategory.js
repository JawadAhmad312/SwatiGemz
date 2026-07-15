import mongoose from "mongoose";

const Schema = mongoose.Schema;

const mencategorySchema = new Schema({
  
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
mencategorySchema.pre("save", function () {

  /* AUTO PRODUCT CODE */

  if (!this.details.productCode) {

    this.details.productCode =

      "MEN-" +

      Math.floor(
        100000 + Math.random() * 900000
      );
  }

  /* AUTO SOLD OUT */

  this.soldOut =
    this.stockquantity <= 0;

});

const MenCategory = mongoose.model(
  "MenCategory",
  mencategorySchema
);

export default MenCategory;