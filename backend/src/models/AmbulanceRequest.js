const mongoose = require("mongoose");

const locationPointSchema = new mongoose.Schema(
  {
    address: {
      type: String,
      trim: true,
      default: "",
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0],
    },
  },
  { _id: false }
);

const ambulanceRequestSchema = new mongoose.Schema(
  {
    requesterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
      default: null,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      index: true,
      default: null,
    },
    pickupLocation: {
      type: locationPointSchema,
      required: true,
    },
    destination: {
      type: locationPointSchema,
      default: () => ({ address: "", coordinates: [0, 0] }),
    },
    emergencyType: {
      type: String,
      required: [true, "Emergency type is required"],
      trim: true,
    },
    symptoms: [
      {
        type: String,
        trim: true,
      },
    ],
    contactNumber: {
      type: String,
      required: [true, "Contact number is required"],
      trim: true,
    },
    assignedAmbulanceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ambulance",
      index: true,
      default: null,
    },
    assignedHospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      index: true,
      default: null,
    },
    status: {
      type: String,
      enum: {
        values: [
          "requested",
          "accepted",
          "dispatched",
          "en_route",
          "arrived",
          "transporting",
          "completed",
          "cancelled",
        ],
        message: "{VALUE} is not a valid status",
      },
      default: "requested",
      index: true,
    },
    requestedAt: {
      type: Date,
      default: Date.now,
    },
    acceptedAt: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    cancellationReason: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const AmbulanceRequest = mongoose.model("AmbulanceRequest", ambulanceRequestSchema);

module.exports = AmbulanceRequest;
