import mongoose from "mongoose";
const Schema = mongoose.Schema;

const womenringSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    default: ""
  },
  category: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  images: {
    type: [String],
    default: []
  },
  stockquantity: {
    type: Number,
    default: 0
  },
  stoneWeight: {
    type: Number,
    required: true
  },
  ringSize: {
    type: Number,
    required: true
  },
  metal: {
    type: String
  },
  weightUnit: {
    type: String,
    enum: ["crt", "gram", "ratti"],
    default: "crt"
  },
  isFeatured: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });


womenringSchema.pre("save", function () {

  this.soldOut =
    this.stockquantity <= 0;
});

const WomenRing = mongoose.model(
  "WomenRing",
 womenringSchema
);

export default WomenRing;