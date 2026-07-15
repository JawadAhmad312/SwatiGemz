import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  items: [
    {
      productId: String,
      name: String,
      price: Number,
      quantity: Number,
      image: String
    }
  ],

  subtotal: Number,

  shipping: Number,

  tax: Number,

  total: Number,

  shippingAddress: {
    email: String,
    firstName: String,
    lastName: String,
    address: String,
    city: String,
    phone: String
  },

  paymentMethod: {
    type: String,
    enum: ["COD", "Bank Deposit"],
    default: "COD"
  },
orderNumber: {
  type: String,
  unique: true,
},
 orderStatus: {
  type: String,
  enum: [
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled"
  ],
  default: "Pending"
},
paymentProof: String,
customerEmail: {
  type: String,
  required: true
},
  createdAt: {
    type: Date,
    default: Date.now
  }

}, { timestamps: true });


const Order = mongoose.model(
  "Order",
 orderSchema
);

export default Order;