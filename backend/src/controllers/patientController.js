const Patient = require("../models/Patient");
const User = require("../models/User");

/**
 * @route   POST /api/patients
 * @desc    Create or update patient medical profile
 * @access  Private
 */
const createOrUpdatePatientProfile = async (req, res) => {
  try {
    const { bloodGroup, allergies, emergencyContacts, medicationHistory, insuranceInfo } = req.body;
    let targetUserId = req.user._id;

    // Super admin, hospital admin, or doctor can specify userId
    if (["super_admin", "hospital_admin", "doctor"].includes(req.user.role) && req.body.userId) {
      targetUserId = req.body.userId;
    }

    const user = await User.findById(targetUserId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    let patient = await Patient.findOne({ userId: targetUserId });

    if (patient) {
      // Update
      patient.bloodGroup = bloodGroup || patient.bloodGroup;
      if (allergies) patient.allergies = allergies;
      if (emergencyContacts) patient.emergencyContacts = emergencyContacts;
      if (medicationHistory) patient.medicationHistory = medicationHistory;
      if (insuranceInfo) patient.insuranceInfo = insuranceInfo;
      await patient.save();
    } else {
      // Create
      patient = new Patient({
        userId: targetUserId,
        bloodGroup: bloodGroup || "unknown",
        allergies: allergies || [],
        emergencyContacts: emergencyContacts || [],
        medicationHistory: medicationHistory || [],
        insuranceInfo: insuranceInfo || {},
      });
      await patient.save();
    }

    return res.status(200).json({
      success: true,
      message: "Patient profile saved successfully.",
      data: patient,
    });
  } catch (error) {
    console.error("createOrUpdatePatientProfile error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to save patient profile.",
    });
  }
};

/**
 * @route   GET /api/patients/me
 * @desc    Get logged in user's patient profile
 * @access  Private (patient)
 */
const getMyPatientProfile = async (req, res) => {
  try {
    let patient = await Patient.findOne({ userId: req.user._id }).populate(
      "userId",
      "firstName lastName email phone dateOfBirth gender address city state country"
    );

    if (!patient) {
      // Return empty profile structure if not yet initialized
      return res.status(200).json({
        success: true,
        data: {
          userId: req.user,
          bloodGroup: "unknown",
          allergies: [],
          emergencyContacts: [],
          medicationHistory: [],
          insuranceInfo: {},
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    console.error("getMyPatientProfile error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch patient profile.",
    });
  }
};

/**
 * @route   GET /api/patients/:id
 * @desc    Get patient profile by Patient ID
 * @access  Private (Patient self, Doctor, Hospital Admin, Super Admin)
 */
const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).populate(
      "userId",
      "firstName lastName email phone dateOfBirth gender address city state country"
    );

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient profile not found.",
      });
    }

    // Access control: Patient can only view their own profile
    if (
      req.user.role === "patient" &&
      patient.userId?._id?.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only view your own profile.",
      });
    }

    return res.status(200).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    console.error("getPatientById error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch patient profile.",
    });
  }
};

module.exports = {
  createOrUpdatePatientProfile,
  getMyPatientProfile,
  getPatientById,
};
