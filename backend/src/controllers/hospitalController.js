const Hospital = require("../models/Hospital");
const { buildQueryResult } = require("../utils/queryHelper");

/**
 * @route   POST /api/hospitals
 * @desc    Create a new hospital
 * @access  Private (super_admin, hospital_admin)
 */
const createHospital = async (req, res) => {
  try {
    const {
      name,
      licenseNumber,
      description,
      phone,
      email,
      address,
      city,
      state,
      country,
      location,
      emergencyAvailable,
      facilities,
      operatingHours,
    } = req.body;

    if (!name || !licenseNumber || !phone || !email || !address || !city || !state) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: name, licenseNumber, phone, email, address, city, state.",
      });
    }

    const existing = await Hospital.findOne({ licenseNumber: licenseNumber.trim() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "A hospital with this license number already exists.",
      });
    }

    // Assign adminId
    let adminId = req.user._id;
    let verificationStatus = "pending";

    // super_admin can set adminId or verify immediately
    if (req.user.role === "super_admin") {
      if (req.body.adminId) adminId = req.body.adminId;
      if (req.body.verificationStatus) verificationStatus = req.body.verificationStatus;
    }

    const hospital = new Hospital({
      name,
      licenseNumber,
      description,
      phone,
      email,
      address,
      city,
      state,
      country,
      location,
      emergencyAvailable,
      facilities,
      operatingHours,
      verificationStatus,
      adminId,
    });

    await hospital.save();

    return res.status(201).json({
      success: true,
      message: "Hospital created successfully.",
      data: hospital,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "License number must be unique.",
      });
    }
    console.error("createHospital error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create hospital.",
    });
  }
};

/**
 * @route   GET /api/hospitals
 * @desc    Get list of hospitals (with pagination, search, filter, sort)
 * @access  Public / Private
 */
const getHospitals = async (req, res) => {
  try {
    const filter = {};

    // Filter by verificationStatus based on user role
    const userRole = req.user?.role;
    if (userRole === "super_admin") {
      if (req.query.verificationStatus) {
        filter.verificationStatus = req.query.verificationStatus;
      }
    } else if (userRole === "hospital_admin") {
      // hospital_admin sees verified + their own hospital
      filter.$or = [
        { verificationStatus: "verified" },
        { adminId: req.user._id },
      ];
    } else {
      // Patients / public only see verified hospitals
      filter.verificationStatus = "verified";
    }

    // Specific filters
    if (req.query.city) filter.city = new RegExp(`^${req.query.city.trim()}$`, "i");
    if (req.query.state) filter.state = new RegExp(`^${req.query.state.trim()}$`, "i");
    if (req.query.emergencyAvailable !== undefined) {
      filter.emergencyAvailable = req.query.emergencyAvailable === "true";
    }

    const searchFields = ["name", "city", "state", "address"];
    const result = await buildQueryResult(Hospital, filter, req.query, searchFields);

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("getHospitals error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch hospitals.",
    });
  }
};

/**
 * @route   GET /api/hospitals/:id
 * @desc    Get hospital details by ID
 * @access  Public / Private
 */
const getHospitalById = async (req, res, next) => {
  try {
    const hospital = await Hospital.findById(req.params.id);

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: "Hospital not found.",
      });
    }

    // Access check for unverified hospitals
    if (hospital.verificationStatus !== "verified") {
      const userRole = req.user?.role;
      const isOwner = req.user && hospital.adminId?.toString() === req.user._id.toString();

      if (userRole !== "super_admin" && !isOwner) {
        return res.status(403).json({
          success: false,
          message: "Access denied. Hospital verification is pending.",
        });
      }
    }

    return res.status(200).json({
      success: true,
      data: hospital,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/hospitals/:id
 * @desc    Update hospital details
 * @access  Private (super_admin, hospital_admin of the hospital)
 */
const updateHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: "Hospital not found.",
      });
    }

    const userRole = req.user.role;
    const isOwner = hospital.adminId?.toString() === req.user._id.toString();

    if (userRole !== "super_admin" && !isOwner) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only update your own hospital.",
      });
    }

    const updates = { ...req.body };

    // Prevent non-super_admin from changing verificationStatus or adminId
    if (userRole !== "super_admin") {
      delete updates.verificationStatus;
      delete updates.adminId;
    }

    const updatedHospital = await Hospital.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Hospital updated successfully.",
      data: updatedHospital,
    });
  } catch (error) {
    console.error("updateHospital error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update hospital.",
    });
  }
};

/**
 * @route   DELETE /api/hospitals/:id
 * @desc    Delete hospital
 * @access  Private (super_admin, hospital_admin of the hospital)
 */
const deleteHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: "Hospital not found.",
      });
    }

    const userRole = req.user.role;
    const isOwner = hospital.adminId?.toString() === req.user._id.toString();

    if (userRole !== "super_admin" && !isOwner) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only delete your own hospital.",
      });
    }

    await Hospital.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Hospital deleted successfully.",
    });
  } catch (error) {
    console.error("deleteHospital error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete hospital.",
    });
  }
};

module.exports = {
  createHospital,
  getHospitals,
  getHospitalById,
  updateHospital,
  deleteHospital,
};
