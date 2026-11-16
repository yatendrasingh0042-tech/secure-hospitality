const express = require("express");
const router = express.Router();
const {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
} = require("../controllers/appointmentController");
const { requireAuth } = require("../middleware/auth");

// All appointment endpoints require authentication
router.use(requireAuth);

router.post("/", createAppointment);
router.get("/", getAppointments);
router.get("/:id", getAppointmentById);
router.patch("/:id", updateAppointment);
router.delete("/:id", deleteAppointment);

module.exports = router;
