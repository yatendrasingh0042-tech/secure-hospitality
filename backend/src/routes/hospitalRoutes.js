const express = require("express");
const router = express.Router();
const {
  createHospital,
  getHospitals,
  getHospitalById,
  updateHospital,
  deleteHospital,
} = require("../controllers/hospitalController");
const { requireAuth, optionalAuth, requireRole } = require("../middleware/auth");

// Public / optional auth routes
router.get("/", optionalAuth, getHospitals);
router.get("/:id", optionalAuth, getHospitalById);

// Protected routes (super_admin, hospital_admin)
router.post("/", requireAuth, requireRole("super_admin", "hospital_admin"), createHospital);
router.put("/:id", requireAuth, requireRole("super_admin", "hospital_admin"), updateHospital);
router.delete("/:id", requireAuth, requireRole("super_admin", "hospital_admin"), deleteHospital);

module.exports = router;
