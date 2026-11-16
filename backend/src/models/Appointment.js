const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: [true, "Patient ID is required"],
      index: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: [true, "Doctor ID is required"],
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
    appointmentDate: {
      type: Date,
      required: [true, "Appointment date is required"],
      index: true,
    },
    startTime: {
      type: String,
      required: [true, "Start time is required"],
      trim: true,
    },
    endTime: {
      type: String,
      required: [true, "End time is required"],
      trim: true,
    },
    appointmentType: {
      type: String,
      enum: {
        values: ["in_person", "video", "teleconsultation", "video_call", "follow_up"],
        message: "{VALUE} is not a valid appointment type",
      },
      default: "in_person",
    },
    consultationFee: {
      type: Number,
      min: [0, "Consultation fee cannot be negative"],
      default: 0,
    },
    reason: {
      type: String,
      required: [true, "Reason for appointment is required"],
      trim: true,
    },
    symptoms: [
      {
        type: String,
        trim: true,
      },
    ],
    status: {
      type: String,
      enum: {
        values: ["pending", "confirmed", "completed", "cancelled", "rejected", "no_show"],
        message: "{VALUE} is not a valid status",
      },
      default: "pending",
      index: true,
    },
    cancellationReason: {
      type: String,
      trim: true,
      default: "",
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for double-booking checks and schedule lookups
appointmentSchema.index({ doctorId: 1, appointmentDate: 1, startTime: 1 });
appointmentSchema.index({ patientId: 1, appointmentDate: 1 });
appointmentSchema.index({ hospitalId: 1, appointmentDate: 1, status: 1 });

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
