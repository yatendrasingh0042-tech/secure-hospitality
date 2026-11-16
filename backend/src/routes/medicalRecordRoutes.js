const express = require("express");
const router = express.Router();
const {
  createMedicalRecord,
  getMedicalRecords,
  getMedicalRecordById,
  updateMedicalRecord,
  archiveMedicalRecord,
} = require("../controllers/medicalRecordController");
const { requireAuth, requireRole } = require("../middleware/auth");

// All medical record endpoints MUST be strictly private and require authentication
router.use(requireAuth);

// Get list & single record (Privacy enforced inside controllers)
router.get("/", getMedicalRecords);
router.get("/:id", getMedicalRecordById);

// Create, Update, and Archive (Controlled roles)
router.post("/", requireRole("doctor", "hospital_admin", "super_admin"), createMedicalRecord);
router.put("/:id", requireRole("doctor", "hospital_admin", "super_admin"), updateMedicalRecord);
router.delete("/:id", requireRole("doctor", "hospital_admin", "super_admin"), archiveMedicalRecord);

module.exports = router;
