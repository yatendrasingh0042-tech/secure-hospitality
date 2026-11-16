const express = require("express");
const router = express.Router();
const {
  getDashboardOverview,
  getUserStats,
  getPatientStats,
  getDoctorStats,
  getHospitalStats,
  getAppointmentStats,
  getPharmacyStats,
  getAmbulanceStats,
  getNotificationStats,
} = require("../controllers/adminStatsController");
const { requireAuth, requireAdmin } = require("../middleware/auth");

router.use(requireAuth);
router.use(requireAdmin);

router.get("/dashboard", getDashboardOverview);
router.get("/stats", getDashboardOverview);
router.get("/stats/users", getUserStats);
router.get("/stats/patients", getPatientStats);
router.get("/stats/doctors", getDoctorStats);
router.get("/stats/hospitals", getHospitalStats);
router.get("/stats/appointments", getAppointmentStats);
router.get("/stats/pharmacy", getPharmacyStats);
router.get("/stats/ambulances", getAmbulanceStats);
router.get("/stats/notifications", getNotificationStats);

module.exports = router;
