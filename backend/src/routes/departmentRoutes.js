const express = require("express");
const router = express.Router();
const {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
} = require("../controllers/departmentController");
const { requireAuth, optionalAuth, requireRole } = require("../middleware/auth");

// Public / optional auth routes
router.get("/", optionalAuth, getDepartments);
router.get("/:id", optionalAuth, getDepartmentById);

// Protected routes (super_admin, hospital_admin)
router.post("/", requireAuth, requireRole("super_admin", "hospital_admin"), createDepartment);
router.put("/:id", requireAuth, requireRole("super_admin", "hospital_admin"), updateDepartment);
router.delete("/:id", requireAuth, requireRole("super_admin", "hospital_admin"), deleteDepartment);

module.exports = router;
