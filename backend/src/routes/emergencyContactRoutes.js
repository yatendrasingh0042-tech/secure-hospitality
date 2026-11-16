const express = require("express");
const router = express.Router();
const {
  getEmergencyContacts,
  addEmergencyContact,
  updateEmergencyContact,
  deleteEmergencyContact,
} = require("../controllers/emergencyContactController");
const { requireAuth } = require("../middleware/auth");

// All emergency contact routes require authentication
router.use(requireAuth);

router.get("/", getEmergencyContacts);
router.post("/", addEmergencyContact);
router.patch("/:id", updateEmergencyContact);
router.put("/:id", updateEmergencyContact);
router.delete("/:id", deleteEmergencyContact);

module.exports = router;
