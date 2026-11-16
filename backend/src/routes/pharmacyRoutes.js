const express = require("express");
const router = express.Router();
const {
  createPharmacy,
  getPharmacies,
  getPharmacyById,
  updatePharmacy,
} = require("../controllers/pharmacyController");
const { requireAuth, optionalAuth, requireRole } = require("../middleware/auth");

router.get("/", optionalAuth, getPharmacies);
router.get("/:id", optionalAuth, getPharmacyById);

router.post("/", requireAuth, requireRole("super_admin", "hospital_admin"), createPharmacy);
router.put("/:id", requireAuth, requireRole("super_admin", "hospital_admin"), updatePharmacy);

module.exports = router;
