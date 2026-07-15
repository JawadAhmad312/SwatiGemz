import mongoose from "mongoose";
const Schema = mongoose.Schema;


const reviewSchema = new Schema({
  comment: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }, stock: {
    type: Number,
    default: 0
  }
});


const Review = mongoose.model(
  "Review",
  reviewSchema
);

export default Review;