const mongoose = require("mongoose");

const allergySchema = new mongoose.Schema(
  {
    allergen: {
      type: String,
      required: true,
      trim: true,
    },
    severity: {
      type: String,
      enum: ["mild", "moderate", "severe"],
      default: "moderate",
    },
    reaction: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { _id: false }
);

const emergencyContactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    relationship: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const medicationHistorySchema = new mongoose.Schema(
  {
    medicationName: {
      type: String,
      required: true,
      trim: true,
    },
    dosage: {
      type: String,
      trim: true,
      default: "",
    },
    startDate: {
      type: Date,
      default: null,
    },
    endDate: {
      type: Date,
      default: null,
    },
    isCurrent: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false }
);

const patientSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      unique: true,
      index: true,
    },
    bloodGroup: {
      type: String,
      enum: {
        values: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "unknown"],
        message: "{VALUE} is not a valid blood group",
      },
      default: "unknown",
    },
    allergies: [allergySchema],
    emergencyContacts: [emergencyContactSchema],
    medicationHistory: [medicationHistorySchema],
    insuranceInfo: {
      provider: { type: String, trim: true, default: "" },
      policyNumber: { type: String, trim: true, default: "" },
      expiryDate: { type: Date, default: null },
    },
  },
  {
    timestamps: true,
  }
);

const Patient = mongoose.model("Patient", patientSchema);

module.exports = Patient;
