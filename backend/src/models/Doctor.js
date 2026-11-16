const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema(
  {
    day: {
      type: String,
      enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      required: true,
    },
    startTime: {
      type: String, // e.g. "09:00"
      required: true,
    },
    endTime: {
      type: String, // e.g. "17:00"
      required: true,
    },
  },
  { _id: false }
);

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      unique: true,
      index: true,
    },
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: [true, "Hospital ID is required"],
      index: true,
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      index: true,
    },
    specialization: {
      type: String,
      required: [true, "Specialization is required"],
      trim: true,
      index: true,
    },
    qualification: {
      type: String,
      required: [true, "Qualification is required"],
      trim: true,
    },
    experience: {
      type: Number,
      min: [0, "Experience cannot be negative"],
      default: 0,
    },
    licenseNumber: {
      type: String,
      required: [true, "Medical license number is required"],
      unique: true,
      trim: true,
    },
    consultationFee: {
      type: Number,
      min: [0, "Consultation fee cannot be negative"],
      default: 0,
    },
    consultationFees: {
      inPerson: { type: Number, min: 0 },
      videoCall: { type: Number, min: 0 },
      followUp: { type: Number, min: 0 },
    },
    availability: [availabilitySchema],
    languages: [
      {
        type: String,
        trim: true,
      },
    ],
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

const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;
