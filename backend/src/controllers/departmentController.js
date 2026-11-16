const Department = require("../models/Department");
const Hospital = require("../models/Hospital");
const { buildQueryResult } = require("../utils/queryHelper");

/**
 * Helper to check if current user has management permissions over a hospital
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
 * @route   POST /api/departments
 * @desc    Create department under a hospital
 * @access  Private (super_admin, hospital_admin)
 */
const createDepartment = async (req, res) => {
  try {
    const { hospitalId, name, description, status } = req.body;

    if (!hospitalId || !name) {
      return res.status(400).json({
        success: false,
        message: "hospitalId and department name are required.",
      });
    }

    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: "Target hospital not found.",
      });
    }

    const hasAccess = await canManageHospital(req.user._id, req.user.role, hospitalId);
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only create departments for your own hospital.",
      });
    }

    const existing = await Department.findOne({ hospitalId, name: name.trim() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "A department with this name already exists in the hospital.",
      });
    }

    const department = new Department({
      hospitalId,
      name,
      description,
      status: status || "active",
    });

    await department.save();

    return res.status(201).json({
      success: true,
      message: "Department created successfully.",
      data: department,
    });
  } catch (error) {
    console.error("createDepartment error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create department.",
    });
  }
};

/**
 * @route   GET /api/departments
 * @desc    Get departments list
 * @access  Public / Private
 */
const getDepartments = async (req, res) => {
  try {
    const filter = {};

    if (req.query.hospitalId) filter.hospitalId = req.query.hospitalId;
    if (req.query.status) filter.status = req.query.status;

    const searchFields = ["name", "description"];
    const populateOptions = [{ path: "hospitalId", select: "name city state" }];

    const result = await buildQueryResult(Department, filter, req.query, searchFields, populateOptions);

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("getDepartments error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch departments.",
    });
  }
};

/**
 * @route   GET /api/departments/:id
 * @desc    Get department by ID
 * @access  Public / Private
 */
const getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id).populate("hospitalId", "name city state");

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: department,
    });
  } catch (error) {
    console.error("getDepartmentById error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch department.",
    });
  }
};

/**
 * @route   PUT /api/departments/:id
 * @desc    Update department
 * @access  Private (super_admin, hospital_admin)
 */
const updateDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found.",
      });
    }

    const hasAccess = await canManageHospital(req.user._id, req.user.role, department.hospitalId);
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only update departments for your own hospital.",
      });
    }

    const updatedDepartment = await Department.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Department updated successfully.",
      data: updatedDepartment,
    });
  } catch (error) {
    console.error("updateDepartment error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update department.",
    });
  }
};

/**
 * @route   DELETE /api/departments/:id
 * @desc    Delete department
 * @access  Private (super_admin, hospital_admin)
 */
const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found.",
      });
    }

    const hasAccess = await canManageHospital(req.user._id, req.user.role, department.hospitalId);
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only delete departments for your own hospital.",
      });
    }

    await Department.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Department deleted successfully.",
    });
  } catch (error) {
    console.error("deleteDepartment error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete department.",
    });
  }
};

module.exports = {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
};
