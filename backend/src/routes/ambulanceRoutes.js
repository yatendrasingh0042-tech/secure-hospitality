const express = require("express");
const router = express.Router();
const {
  createAmbulance,
  getAvailableAmbulances,
  getAmbulances,
  updateAmbulanceLocation,
} = require("../controllers/ambulanceController");
const {
  requestAmbulance,
  getAmbulanceRequestById,
  getAmbulanceRequests,
  updateRequestStatus,
} = require("../controllers/ambulanceRequestController");
const { requireAuth, optionalAuth, requireRole } = require("../middleware/auth");

// Public / optional auth emergency endpoints
router.post("/request", optionalAuth, requestAmbulance);
router.get("/available", optionalAuth, getAvailableAmbulances);

// Protected ambulance request endpoints
router.get("/request/:id", requireAuth, getAmbulanceRequestById);
router.patch("/request/:id/status", requireAuth, requireRole("super_admin", "hospital_admin", "doctor"), updateRequestStatus);
router.get("/requests", requireAuth, getAmbulanceRequests);

// Protected ambulance management & real-time tracking architecture endpoints
router.post("/", requireAuth, requireRole("super_admin", "hospital_admin"), createAmbulance);
router.get("/", requireAuth, getAmbulances);
router.patch("/:id/location", requireAuth, updateAmbulanceLocation);

module.exports = router;
