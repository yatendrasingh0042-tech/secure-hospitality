const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: "",
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    licenseNumber: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { _id: false }
);

const ambulanceSchema = new mongoose.Schema(
  {
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: [true, "Hospital ID is required"],
      index: true,
    },
    vehicleNumber: {
      type: String,
      required: [true, "Vehicle registration number is required"],
      unique: true,
      trim: true,
    },
    driver: driverSchema,
    contact: {
      type: String,
      required: [true, "Emergency contact number is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: {
        values: ["basic_life_support", "advanced_life_support", "patient_transport", "neonatal"],
        message: "{VALUE} is not a valid ambulance type",
      },
      default: "basic_life_support",
    },
    equipment: [
      {
        type: String,
        trim: true,
      },
    ],
    availability: {
      type: Boolean,
      default: true,
      index: true,
    },
    currentLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0],
      },
    },
    status: {
      type: String,
      enum: {
        values: ["available", "dispatched", "maintenance", "offline"],
        message: "{VALUE} is not a valid status",
      },
      default: "available",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

ambulanceSchema.index({ currentLocation: "2dsphere" });

const Ambulance = mongoose.model("Ambulance", ambulanceSchema);

module.exports = Ambulance;
