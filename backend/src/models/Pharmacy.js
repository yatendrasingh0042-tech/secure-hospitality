const mongoose = require("mongoose");

const pharmacySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Pharmacy name is required"],
      trim: true,
      index: true,
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Admin/Owner User ID is required"],
      index: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
      index: true,
    },
    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
      index: true,
    },
    contact: {
      type: String,
      required: [true, "Contact number is required"],
      trim: true,
    },
    operatingHours: {
      type: String,
      trim: true,
      default: "24/7",
    },
    verificationStatus: {
      type: String,
      enum: {
        values: ["pending", "verified", "rejected"],
        message: "{VALUE} is not a valid verification status",
      },
      default: "pending",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Pharmacy = mongoose.model("Pharmacy", pharmacySchema);

module.exports = Pharmacy;
