const express = require("express");
const router = express.Router();
const {
  createMedicine,
  getMedicines,
  getMedicineById,
  updateMedicine,
} = require("../controllers/medicineController");
const { requireAuth, optionalAuth, requireRole } = require("../middleware/auth");

router.get("/", optionalAuth, getMedicines);
router.get("/:id", optionalAuth, getMedicineById);

router.post("/", requireAuth, requireRole("super_admin", "hospital_admin"), createMedicine);
router.put("/:id", requireAuth, requireRole("super_admin", "hospital_admin"), updateMedicine);

module.exports = router;
