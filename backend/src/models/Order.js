const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    medicineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medicine",
      required: true,
    },
    medicineName: {
      type: String,
      required: true,
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
    items: [orderItemSchema],
    subtotal: {
      type: Number,
      required: [true, "Subtotal is required"],
      min: 0,
    },
    deliveryMethod: {
      type: String,
      enum: ["standard", "express"],
      default: "standard",
    },
    deliveryFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    deliveryCharge: {
      type: Number,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      required: [true, "Total price is required"],
      min: 0,
    },
    deliveryAddress: {
      type: String,
      required: [true, "Delivery address is required"],
      trim: true,
    },
    paymentStatus: {
      type: String,
      enum: {
        values: ["pending", "paid", "failed", "refunded"],
        message: "{VALUE} is not a valid payment status",
      },
      default: "pending",
      index: true,
    },
    orderStatus: {
      type: String,
      enum: {
        values: ["pending", "confirmed", "preparing", "dispatched", "delivered", "cancelled"],
        message: "{VALUE} is not a valid order status",
      },
      default: "pending",
      index: true,
    },
    prescriptionReference: {
      type: String,
      trim: true,
      default: "",
    },
    paymentDetails: {
      transactionId: { type: String, trim: true, default: "" },
      paymentMethod: { type: String, trim: true, default: "mock_card" },
      paidAt: { type: Date, default: null },
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
