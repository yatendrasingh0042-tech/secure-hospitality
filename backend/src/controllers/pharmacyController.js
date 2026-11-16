const Pharmacy = require("../models/Pharmacy");
const { buildQueryResult } = require("../utils/queryHelper");

/**
 * @route   POST /api/pharmacies
 * @desc    Create a new pharmacy
 * @access  Private (super_admin, hospital_admin)
 */
const createPharmacy = async (req, res) => {
  try {
    const { name, address, city, state, contact, operatingHours } = req.body;

    if (!name || !address || !city || !state || !contact) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: name, address, city, state, contact.",
      });
    }

    let adminId = req.user._id;
    let verificationStatus = "pending";

    if (req.user.role === "super_admin") {
      if (req.body.adminId) adminId = req.body.adminId;
      if (req.body.verificationStatus) verificationStatus = req.body.verificationStatus;
    }

    const pharmacy = new Pharmacy({
      name,
      adminId,
      address,
      city,
      state,
      contact,
      operatingHours: operatingHours || "24/7",
      verificationStatus,
    });

    await pharmacy.save();

    return res.status(201).json({
      success: true,
      message: "Pharmacy created successfully.",
      data: pharmacy,
    });
  } catch (error) {
    console.error("createPharmacy error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create pharmacy.",
    });
  }
};

/**
 * @route   GET /api/pharmacies
 * @desc    Get list of pharmacies
 * @access  Public / Private
 */
const getPharmacies = async (req, res) => {
  try {
    const filter = {};

    const userRole = req.user?.role;
    if (userRole === "super_admin") {
      if (req.query.verificationStatus) filter.verificationStatus = req.query.verificationStatus;
    } else if (userRole === "hospital_admin") {
      filter.$or = [{ verificationStatus: "verified" }, { adminId: req.user._id }];
    } else {
      filter.verificationStatus = "verified";
    }

    if (req.query.city) filter.city = new RegExp(`^${req.query.city.trim()}$`, "i");
    if (req.query.state) filter.state = new RegExp(`^${req.query.state.trim()}$`, "i");

    const searchFields = ["name", "city", "state", "address"];
    const result = await buildQueryResult(Pharmacy, filter, req.query, searchFields);

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("getPharmacies error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch pharmacies.",
    });
  }
};

/**
 * @route   GET /api/pharmacies/:id
 * @desc    Get pharmacy by ID
 * @access  Public / Private
 */
const getPharmacyById = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findById(req.params.id);

    if (!pharmacy) {
      return res.status(404).json({
        success: false,
        message: "Pharmacy not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: pharmacy,
    });
  } catch (error) {
    console.error("getPharmacyById error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch pharmacy details.",
    });
  }
};

/**
 * @route   PUT /api/pharmacies/:id
 * @desc    Update pharmacy details
 * @access  Private (super_admin, pharmacy owner)
 */
const updatePharmacy = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findById(req.params.id);

    if (!pharmacy) {
      return res.status(404).json({
        success: false,
        message: "Pharmacy not found.",
      });
    }

    const isOwner = pharmacy.adminId.toString() === req.user._id.toString();
    if (req.user.role !== "super_admin" && !isOwner) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only update your own pharmacy.",
      });
    }

    const updates = { ...req.body };
    if (req.user.role !== "super_admin") {
      delete updates.verificationStatus;
      delete updates.adminId;
    }

    const updatedPharmacy = await Pharmacy.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Pharmacy updated successfully.",
      data: updatedPharmacy,
    });
  } catch (error) {
    console.error("updatePharmacy error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update pharmacy.",
    });
  }
};

module.exports = {
  createPharmacy,
  getPharmacies,
  getPharmacyById,
  updatePharmacy,
};
