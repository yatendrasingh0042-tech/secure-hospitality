const Doctor = require("../models/Doctor");
const Hospital = require("../models/Hospital");
const User = require("../models/User");
const { buildQueryResult } = require("../utils/queryHelper");

/**
 * Helper to verify hospital management access
 */
const canManageHospital = async (userId, userRole, hospitalId) => {
  if (userRole === "super_admin") return true;
  if (userRole === "hospital_admin") {
    const hospital = await Hospital.findById(hospitalId);
    return hospital && hospital.adminId?.toString() === userId.toString();
  }
  return false;
};

/**
 * @route   POST /api/doctors
 * @desc    Create doctor profile
 * @access  Private (super_admin, hospital_admin, doctor)
 */
const createDoctor = async (req, res) => {
  try {
    const {
      userId,
      hospitalId,
      departmentId,
      specialization,
      qualification,
      experience,
      licenseNumber,
      consultationFee,
      availability,
      languages,
    } = req.body;

    const targetUserId = userId || req.user._id;

    if (!targetUserId || !hospitalId || !specialization || !qualification || !licenseNumber) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: userId, hospitalId, specialization, qualification, licenseNumber.",
      });
    }

    // Check user exists
    const user = await User.findById(targetUserId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Check target hospital exists
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: "Hospital not found.",
      });
    }

    // Authorization checks
    const userRole = req.user.role;
    const isSelfDoctor = userRole === "doctor" && targetUserId.toString() === req.user._id.toString();
    const isHospitalAdmin = await canManageHospital(req.user._id, userRole, hospitalId);

    if (userRole !== "super_admin" && !isHospitalAdmin && !isSelfDoctor) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Insufficient permissions to create doctor profile.",
      });
    }

    // Check duplicate doctor profile or license
    const existingDoctor = await Doctor.findOne({
      $or: [{ userId: targetUserId }, { licenseNumber: licenseNumber.trim() }],
    });

    if (existingDoctor) {
      return res.status(400).json({
        success: false,
        message: "Doctor profile or license number already exists.",
      });
    }

    let verificationStatus = "pending";
    if (userRole === "super_admin" && req.body.verificationStatus) {
      verificationStatus = req.body.verificationStatus;
    }

    const doctor = new Doctor({
      userId: targetUserId,
      hospitalId,
      departmentId,
      specialization,
      qualification,
      experience: experience || 0,
      licenseNumber,
      consultationFee: consultationFee || 0,
      availability: availability || [],
      languages: languages || [],
      verificationStatus,
    });

    await doctor.save();

    return res.status(201).json({
      success: true,
      message: "Doctor profile created successfully.",
      data: doctor,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "License number or user profile already exists.",
      });
    }
    console.error("createDoctor error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create doctor profile.",
    });
  }
};

/**
 * @route   GET /api/doctors
 * @desc    Get list of doctors with pagination, search, filter, sort
 * @access  Public / Private
 */
const getDoctors = async (req, res) => {
  try {
    const filter = {};

    const userRole = req.user?.role;
    if (userRole === "super_admin") {
      if (req.query.verificationStatus) filter.verificationStatus = req.query.verificationStatus;
    } else if (userRole === "hospital_admin") {
      filter.verificationStatus = "verified"; // or filtered by hospital
    } else {
      filter.verificationStatus = "verified";
    }

    if (req.query.hospitalId) filter.hospitalId = req.query.hospitalId;
    if (req.query.departmentId) filter.departmentId = req.query.departmentId;
    if (req.query.specialization) {
      filter.specialization = new RegExp(`^${req.query.specialization.trim()}$`, "i");
    }

    const searchFields = ["specialization", "qualification", "licenseNumber"];
    const populateOptions = [
      { path: "userId", select: "firstName lastName email phone avatar role" },
      { path: "hospitalId", select: "name city state address" },
      { path: "departmentId", select: "name" },
    ];

    const result = await buildQueryResult(Doctor, filter, req.query, searchFields, populateOptions);

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("getDoctors error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch doctors.",
    });
  }
};

/**
 * @route   GET /api/doctors/:id
 * @desc    Get doctor by ID
 * @access  Public / Private
 */
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate("userId", "firstName lastName email phone avatar")
      .populate("hospitalId", "name city state address emergencyAvailable")
      .populate("departmentId", "name description");

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found.",
      });
    }

    if (doctor.verificationStatus !== "verified") {
      const userRole = req.user?.role;
      const isSelf = req.user && doctor.userId?._id?.toString() === req.user._id.toString();
      const isHospitalAdmin = req.user && (await canManageHospital(req.user._id, userRole, doctor.hospitalId?._id));

      if (userRole !== "super_admin" && !isSelf && !isHospitalAdmin) {
        return res.status(403).json({
          success: false,
          message: "Access denied. Doctor verification is pending.",
        });
      }
    }

    return res.status(200).json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    console.error("getDoctorById error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch doctor details.",
    });
  }
};

/**
 * @route   PUT /api/doctors/:id
 * @desc    Update doctor profile
 * @access  Private (super_admin, managing hospital_admin, doctor self)
 */
const updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found.",
      });
    }

    const userRole = req.user.role;
    const isSelf = doctor.userId?.toString() === req.user._id.toString();
    const isHospitalAdmin = await canManageHospital(req.user._id, userRole, doctor.hospitalId);

    if (userRole !== "super_admin" && !isHospitalAdmin && !isSelf) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only update your own profile or hospital doctors.",
      });
    }

    const updates = { ...req.body };

    // Doctors cannot alter verificationStatus, userId, or hospitalId
    if (userRole !== "super_admin") {
      delete updates.verificationStatus;
      delete updates.userId;
      if (!isHospitalAdmin) {
        delete updates.hospitalId;
      }
    }

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate("userId", "firstName lastName email phone avatar")
     .populate("hospitalId", "name city state")
     .populate("departmentId", "name");

    return res.status(200).json({
      success: true,
      message: "Doctor profile updated successfully.",
      data: updatedDoctor,
    });
  } catch (error) {
    console.error("updateDoctor error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update doctor profile.",
    });
  }
};

/**
 * @route   DELETE /api/doctors/:id
 * @desc    Delete doctor profile
 * @access  Private (super_admin, hospital_admin)
 */
const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found.",
      });
    }

    const userRole = req.user.role;
    const isHospitalAdmin = await canManageHospital(req.user._id, userRole, doctor.hospitalId);

    if (userRole !== "super_admin" && !isHospitalAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only hospital admins or super admins can delete doctor profiles.",
      });
    }

    await Doctor.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Doctor profile deleted successfully.",
    });
  } catch (error) {
    console.error("deleteDoctor error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete doctor profile.",
    });
  }
};

module.exports = {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
};
