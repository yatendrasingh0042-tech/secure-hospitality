const Medicine = require("../models/Medicine");
const Pharmacy = require("../models/Pharmacy");
const { buildQueryResult } = require("../utils/queryHelper");

/**
 * @route   POST /api/medicines
 * @desc    Create a new medicine listing
 * @access  Private (super_admin, hospital_admin)
 */
const createMedicine = async (req, res) => {
  try {
    const {
      pharmacyId,
      name,
      genericName,
      category,
      manufacturer,
      description,
      dosageForm,
      strength,
      price,
      stock,
      prescriptionRequired,
    } = req.body;

    if (!name || !category || price === undefined) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: name, category, price.",
      });
    }

    let initialStock = stock !== undefined ? Number(stock) : 0;
    let status = initialStock > 0 ? "active" : "out_of_stock";

    const medicine = new Medicine({
      pharmacyId,
      name,
      genericName: genericName || "",
      category,
      manufacturer: manufacturer || "",
      description: description || "",
      dosageForm: dosageForm || "tablet",
      strength: strength || "",
      price: Number(price),
      stock: initialStock,
      prescriptionRequired: Boolean(prescriptionRequired),
      status,
    });

    await medicine.save();

    return res.status(201).json({
      success: true,
      message: "Medicine catalog item created successfully.",
      data: medicine,
    });
  } catch (error) {
    console.error("createMedicine error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create medicine item.",
    });
  }
};

/**
 * @route   GET /api/medicines
 * @desc    Get medicine catalog with search, filtering, and pagination
 * @access  Public / Private
 */
const getMedicines = async (req, res) => {
  try {
    const filter = {};

    if (req.query.category) filter.category = new RegExp(`^${req.query.category.trim()}$`, "i");
    if (req.query.dosageForm) filter.dosageForm = req.query.dosageForm;
    if (req.query.prescriptionRequired !== undefined) {
      filter.prescriptionRequired = req.query.prescriptionRequired === "true";
    }
    if (req.query.status) {
      filter.status = req.query.status;
    } else if (req.user?.role !== "super_admin") {
      filter.status = { $ne: "discontinued" };
    }
    if (req.query.pharmacyId) filter.pharmacyId = req.query.pharmacyId;

    const searchFields = ["name", "genericName", "category", "manufacturer"];
    const populateOptions = [{ path: "pharmacyId", select: "name city state" }];

    const result = await buildQueryResult(Medicine, filter, req.query, searchFields, populateOptions);

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("getMedicines error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch medicine catalog.",
    });
  }
};

/**
 * @route   GET /api/medicines/:id
 * @desc    Get medicine details by ID
 * @access  Public / Private
 */
const getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id).populate("pharmacyId", "name address city state contact");

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: medicine,
    });
  } catch (error) {
    console.error("getMedicineById error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch medicine details.",
    });
  }
};

/**
 * @route   PUT /api/medicines/:id
 * @desc    Update medicine listing details or stock
 * @access  Private (super_admin, hospital_admin)
 */
const updateMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found.",
      });
    }

    const updates = { ...req.body };

    // Auto-update status based on stock if stock is updated
    if (updates.stock !== undefined) {
      updates.stock = Number(updates.stock);
      if (updates.stock <= 0) {
        updates.status = "out_of_stock";
      } else if (medicine.status === "out_of_stock") {
        updates.status = "active";
      }
    }

    const updatedMedicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Medicine updated successfully.",
      data: updatedMedicine,
    });
  } catch (error) {
    console.error("updateMedicine error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update medicine.",
    });
  }
};

module.exports = {
  createMedicine,
  getMedicines,
  getMedicineById,
  updateMedicine,
};
