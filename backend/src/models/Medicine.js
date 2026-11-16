const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema(
  {
    pharmacyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pharmacy",
      index: true,
    },
    name: {
      type: String,
      required: [true, "Medicine name is required"],
      trim: true,
      index: true,
    },
    genericName: {
      type: String,
      trim: true,
      index: true,
      default: "",
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      index: true,
    },
    manufacturer: {
      type: String,
      trim: true,
      default: "",
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    dosageForm: {
      type: String,
      enum: {
        values: ["tablet", "capsule", "syrup", "injection", "ointment", "drop", "other"],
        message: "{VALUE} is not a valid dosage form",
      },
      default: "tablet",
    },
    strength: {
      type: String,
      trim: true,
      default: "",
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    stock: {
      type: Number,
      required: [true, "Stock count is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    prescriptionRequired: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: {
        values: ["active", "out_of_stock", "discontinued"],
        message: "{VALUE} is not a valid status",
      },
      default: "active",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound text index for fast search
medicineSchema.index({ name: "text", genericName: "text", category: "text", manufacturer: "text" });

const Medicine = mongoose.model("Medicine", medicineSchema);

module.exports = Medicine;
