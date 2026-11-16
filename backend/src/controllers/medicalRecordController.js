const MedicalRecord = require("../models/MedicalRecord");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Hospital = require("../models/Hospital");
const { buildQueryResult } = require("../utils/queryHelper");

/**
 * Safely extracts string ID whether field is populated object or raw ObjectId
 */
const getRecordObjectId = (field) => {
  if (!field) return null;
  return field._id ? field._id.toString() : field.toString();
};

/**
 * Helper to check authorization over a medical record
 */
const checkRecordAccess = async (user, record) => {
  if (!record) return { allowed: false, reason: "Record not found" };

  if (user.role === "super_admin") return { allowed: true };

  const recordPatientId = getRecordObjectId(record.patientId);
  const recordDoctorId = getRecordObjectId(record.doctorId);
  const recordHospitalId = getRecordObjectId(record.hospitalId);

  if (user.role === "patient") {
    const patient = await Patient.findById(recordPatientId);
    const isOwner = patient && patient.userId.toString() === user._id.toString();
    return { allowed: isOwner, reason: isOwner ? null : "Patients can only access their own records" };
  }

  if (user.role === "doctor") {
    const doctor = await Doctor.findOne({ userId: user._id });
    if (!doctor) return { allowed: false, reason: "Doctor profile not found" };

    const isAttendingDoctor = recordDoctorId === doctor._id.toString();
    const isSameHospital = recordHospitalId === doctor.hospitalId.toString();

    const allowed = isAttendingDoctor || isSameHospital;
    return { allowed, reason: allowed ? null : "Doctors can only access records within their care relationship or hospital" };
  }

  if (user.role === "hospital_admin") {
    const hospital = await Hospital.findById(recordHospitalId);
    const isHospitalAdmin = hospital && hospital.adminId?.toString() === user._id.toString();
    return { allowed: isHospitalAdmin, reason: isHospitalAdmin ? null : "Hospital admins can only access records within their hospital" };
  }

  return { allowed: false, reason: "Unauthorized role" };
};

/**
 * @route   POST /api/medical-records
 * @desc    Create a new medical record
 * @access  Private (doctor, hospital_admin, super_admin)
 */
const createMedicalRecord = async (req, res) => {
  try {
    const {
      patientId,
      doctorId,
      hospitalId,
      diagnosis,
      symptoms,
      notes,
      prescriptions,
      attachments,
      recordDate,
    } = req.body;

    if (!patientId || !diagnosis) {
      return res.status(400).json({
        success: false,
        message: "patientId and diagnosis are required.",
      });
    }

    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found.",
      });
    }

    let resolvedDoctorId = doctorId;
    let resolvedHospitalId = hospitalId;

    if (req.user.role === "doctor") {
      const doctorProfile = await Doctor.findOne({ userId: req.user._id });
      if (!doctorProfile) {
        return res.status(400).json({
          success: false,
          message: "No doctor profile associated with this account.",
        });
      }
      resolvedDoctorId = doctorProfile._id;
      if (!resolvedHospitalId) resolvedHospitalId = doctorProfile.hospitalId;
    } else if (req.user.role === "hospital_admin") {
      const hospital = await Hospital.findOne({ adminId: req.user._id });
      if (hospital) resolvedHospitalId = hospital._id;
    }

    if (!resolvedDoctorId || !resolvedHospitalId) {
      return res.status(400).json({
        success: false,
        message: "doctorId and hospitalId are required.",
      });
    }

    const record = new MedicalRecord({
      patientId,
      doctorId: resolvedDoctorId,
      hospitalId: resolvedHospitalId,
      diagnosis,
      symptoms: symptoms || [],
      notes: notes || "",
      prescriptions: prescriptions || [],
      attachments: attachments || [],
      recordDate: recordDate || new Date(),
    });

    await record.save();

    return res.status(201).json({
      success: true,
      message: "Medical record created successfully.",
      data: record,
    });
  } catch (error) {
    console.error("createMedicalRecord error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create medical record.",
    });
  }
};

/**
 * @route   GET /api/medical-records
 * @desc    Get medical records list (Strict Privacy Enforced)
 * @access  Private
 */
const getMedicalRecords = async (req, res) => {
  try {
    const filter = { isArchived: false };

    // Strict privacy filtering based on role
    if (req.user.role === "patient") {
      if (req.query.patientId) {
        const patient = await Patient.findOne({ userId: req.user._id });
        if (!patient || req.query.patientId !== patient._id.toString()) {
          return res.status(403).json({
            success: false,
            message: "Access denied. Patients can only access their own medical records.",
          });
        }
        filter.patientId = patient._id;
      } else {
        const patient = await Patient.findOne({ userId: req.user._id });
        if (!patient) {
          return res.status(200).json({
            success: true,
            data: [],
            pagination: { total: 0, page: 1, limit: 10, totalPages: 1, hasNextPage: false, hasPrevPage: false },
          });
        }
        filter.patientId = patient._id;
      }
    } else if (req.user.role === "doctor") {
      const doctor = await Doctor.findOne({ userId: req.user._id });
      if (!doctor) {
        return res.status(403).json({
          success: false,
          message: "Doctor profile required to access medical records.",
        });
      }
      filter.$or = [{ doctorId: doctor._id }, { hospitalId: doctor.hospitalId }];
    } else if (req.user.role === "hospital_admin") {
      const hospital = await Hospital.findOne({ adminId: req.user._id });
      if (!hospital) {
        return res.status(403).json({
          success: false,
          message: "Hospital admin account is not linked to any hospital.",
        });
      }
      filter.hospitalId = hospital._id;
    }

    if (req.query.patientId && req.user.role !== "patient") {
      filter.patientId = req.query.patientId;
    }

    const searchFields = ["diagnosis", "notes"];
    const populateOptions = [
      {
        path: "patientId",
        populate: { path: "userId", select: "firstName lastName email phone gender dateOfBirth" },
      },
      {
        path: "doctorId",
        populate: { path: "userId", select: "firstName lastName specialization" },
      },
      { path: "hospitalId", select: "name city state" },
    ];

    const result = await buildQueryResult(MedicalRecord, filter, req.query, searchFields, populateOptions);

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("getMedicalRecords error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch medical records.",
    });
  }
};

/**
 * @route   GET /api/medical-records/:id
 * @desc    Get individual medical record by ID
 * @access  Private (Strict Privacy Check)
 */
const getMedicalRecordById = async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id)
      .populate({
        path: "patientId",
        populate: { path: "userId", select: "firstName lastName email phone gender dateOfBirth" },
      })
      .populate({
        path: "doctorId",
        populate: { path: "userId", select: "firstName lastName specialization" },
      })
      .populate("hospitalId", "name city state address");

    if (!record || record.isArchived) {
      return res.status(404).json({
        success: false,
        message: "Medical record not found.",
      });
    }

    const authCheck = await checkRecordAccess(req.user, record);
    if (!authCheck.allowed) {
      return res.status(403).json({
        success: false,
        message: `Access denied. ${authCheck.reason}`,
      });
    }

    return res.status(200).json({
      success: true,
      data: record,
    });
  } catch (error) {
    console.error("getMedicalRecordById error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch medical record.",
    });
  }
};

/**
 * @route   PUT /api/medical-records/:id
 * @desc    Update medical record
 * @access  Private (doctor, hospital_admin, super_admin)
 */
const updateMedicalRecord = async (req, res) => {
  try {
    if (req.user.role === "patient") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Patients cannot edit medical records.",
      });
    }

    const record = await MedicalRecord.findById(req.params.id);
    if (!record || record.isArchived) {
      return res.status(404).json({
        success: false,
        message: "Medical record not found.",
      });
    }

    const authCheck = await checkRecordAccess(req.user, record);
    if (!authCheck.allowed) {
      return res.status(403).json({
        success: false,
        message: `Access denied. ${authCheck.reason}`,
      });
    }

    const updatedRecord = await MedicalRecord.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Medical record updated successfully.",
      data: updatedRecord,
    });
  } catch (error) {
    console.error("updateMedicalRecord error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update medical record.",
    });
  }
};

/**
 * @route   DELETE /api/medical-records/:id
 * @desc    Controlled deletion / archiving of medical record
 * @access  Private (doctor, hospital_admin, super_admin)
 */
const archiveMedicalRecord = async (req, res) => {
  try {
    if (req.user.role === "patient") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Patients cannot archive medical records.",
      });
    }

    const record = await MedicalRecord.findById(req.params.id);
    if (!record || record.isArchived) {
      return res.status(404).json({
        success: false,
        message: "Medical record not found.",
      });
    }

    const authCheck = await checkRecordAccess(req.user, record);
    if (!authCheck.allowed) {
      return res.status(403).json({
        success: false,
        message: `Access denied. ${authCheck.reason}`,
      });
    }

    // Soft delete / archive with audit trail
    record.isArchived = true;
    record.archivedAt = new Date();
    record.archivedBy = req.user._id;
    await record.save();

    return res.status(200).json({
      success: true,
      message: "Medical record archived successfully.",
      data: {
        id: record._id,
        isArchived: record.isArchived,
        archivedAt: record.archivedAt,
      },
    });
  } catch (error) {
    console.error("archiveMedicalRecord error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to archive medical record.",
    });
  }
};

module.exports = {
  createMedicalRecord,
  getMedicalRecords,
  getMedicalRecordById,
  updateMedicalRecord,
  archiveMedicalRecord,
};
