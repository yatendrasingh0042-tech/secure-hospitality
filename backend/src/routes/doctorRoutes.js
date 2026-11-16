const express = require("express");
const router = express.Router();
const {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
} = require("../controllers/doctorController");
const { requireAuth, optionalAuth, requireRole } = require("../middleware/auth");

// Public / optional auth routes
router.get("/", optionalAuth, getDoctors);
router.get("/:id", optionalAuth, getDoctorById);

// Protected routes (super_admin, hospital_admin, doctor)
router.post("/", requireAuth, requireRole("super_admin", "hospital_admin", "doctor"), createDoctor);
router.put("/:id", requireAuth, requireRole("super_admin", "hospital_admin", "doctor"), updateDoctor);
router.delete("/:id", requireAuth, requireRole("super_admin", "hospital_admin"), deleteDoctor);

module.exports = router;
