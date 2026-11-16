const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Hospital name is required"],
      trim: true,
      index: true,
      maxlength: [150, "Hospital name cannot exceed 150 characters"],
    },
    licenseNumber: {
      type: String,
      required: [true, "License/Registration number is required"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email address is required"],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
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
    country: {
      type: String,
      required: [true, "Country is required"],
      trim: true,
      default: "India",
    },
    location: {
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
    emergencyAvailable: {
      type: Boolean,
      default: false,
      index: true,
    },
    facilities: [
      {
        type: String,
        trim: true,
      },
    ],
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
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

hospitalSchema.index({ location: "2dsphere" });

const Hospital = mongoose.model("Hospital", hospitalSchema);

module.exports = Hospital;
