const express = require("express");
const router = express.Router();
const {
  createOrUpdatePatientProfile,
  getMyPatientProfile,
  getPatientById,
} = require("../controllers/patientController");
const { requireAuth } = require("../middleware/auth");

// All patient endpoints require authentication
router.use(requireAuth);

router.post("/", createOrUpdatePatientProfile);
router.get("/me", getMyPatientProfile);
router.get("/:id", getPatientById);

module.exports = router;
