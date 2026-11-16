const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema(
  {
    medicineName: {
      type: String,
      required: true,
      trim: true,
    },
    dosage: {
      type: String,
      required: true,
      trim: true,
    },
    frequency: {
      type: String,
      trim: true,
      default: "Once daily",
    },
    duration: {
      type: String,
      trim: true,
      default: "5 days",
    },
    instructions: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { _id: false }
);

const attachmentMetadataSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
      trim: true,
    },
    fileType: {
      type: String,
      required: true,
      trim: true,
    },
    fileSize: {
      type: Number, // in bytes
      required: true,
    },
    storageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const medicalRecordSchema = new mongoose.Schema(
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
    diagnosis: {
      type: String,
      required: [true, "Diagnosis is required"],
      trim: true,
    },
    symptoms: [
      {
        type: String,
        trim: true,
      },
    ],
    notes: {
      type: String,
      trim: true,
      default: "",
    },
    prescriptions: [prescriptionSchema],
    attachments: [attachmentMetadataSchema],
    recordDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
    isArchived: {
      type: Boolean,
      default: false,
      index: true,
    },
    archivedAt: {
      type: Date,
      default: null,
    },
    archivedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for patient records querying
medicalRecordSchema.index({ patientId: 1, isArchived: 1, recordDate: -1 });

const MedicalRecord = mongoose.model("MedicalRecord", medicalRecordSchema);

module.exports = MedicalRecord;
