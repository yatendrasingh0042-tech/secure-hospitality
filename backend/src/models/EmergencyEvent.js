const mongoose = require("mongoose");

const emergencyEventSchema = new mongoose.Schema(
  {
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AmbulanceRequest",
      required: true,
      index: true,
    },
    status: {
      type: String,
      required: true,
    },
    location: {
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0],
      },
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const EmergencyEvent = mongoose.model("EmergencyEvent", emergencyEventSchema);

module.exports = EmergencyEvent;
