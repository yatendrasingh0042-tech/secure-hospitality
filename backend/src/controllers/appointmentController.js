const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Hospital = require("../models/Hospital");
const { buildQueryResult } = require("../utils/queryHelper");
const { getAppointmentPrice } = require("../utils/pricing/appointmentPricing");

/**
 * Safely extracts string ID whether field is populated object or raw ObjectId
 */
const getObjectIdStr = (field) => {
  if (!field) return null;
  return field._id ? field._id.toString() : field.toString();
};

/**
 * Helper to verify authorization over an appointment
 */
const checkAppointmentAccess = async (user, appointment) => {
  if (!appointment) return { allowed: false, reason: "Appointment not found" };

  if (user.role === "super_admin") return { allowed: true };

  const patientId = getObjectIdStr(appointment.patientId);
  const doctorId = getObjectIdStr(appointment.doctorId);
  const hospitalId = getObjectIdStr(appointment.hospitalId);

  if (user.role === "patient") {
    const patient = await Patient.findById(patientId);
    const isOwner = patient && patient.userId.toString() === user._id.toString();
    return { allowed: isOwner, reason: isOwner ? null : "Patients can only access their own appointments" };
  }

  if (user.role === "doctor") {
    const doctor = await Doctor.findOne({ userId: user._id });
    const isAssignedDoctor = doctor && doctorId === doctor._id.toString();
    return { allowed: isAssignedDoctor, reason: isAssignedDoctor ? null : "Doctors can only access appointments assigned to them" };
  }

  if (user.role === "hospital_admin") {
    const hospital = await Hospital.findById(hospitalId);
    const isHospitalAdmin = hospital && hospital.adminId?.toString() === user._id.toString();
    return { allowed: isHospitalAdmin, reason: isHospitalAdmin ? null : "Hospital admins can only access appointments in their hospital" };
  }

  return { allowed: false, reason: "Unauthorized role" };
};

/**
 * @route   POST /api/appointments
 * @desc    Book a new appointment (With double-booking prevention)
 * @access  Private (patient, hospital_admin, super_admin, doctor)
 */
const createAppointment = async (req, res) => {
  try {
    let {
      patientId,
      doctorId,
      hospitalId,
      departmentId,
      appointmentDate,
      startTime,
      endTime,
      appointmentType,
      reason,
      symptoms,
    } = req.body;

    // Resolve patientId if user is a patient
    if (req.user.role === "patient") {
      const patient = await Patient.findOne({ userId: req.user._id });
      if (!patient) {
        return res.status(400).json({
          success: false,
          message: "Please complete your patient profile before booking an appointment.",
        });
      }
      patientId = patient._id;
    }

    // Resolve doctorId if user is a doctor
    if (req.user.role === "doctor") {
      const doctor = await Doctor.findOne({ userId: req.user._id });
      if (doctor) {
        doctorId = doctor._id;
        if (!hospitalId) hospitalId = doctor.hospitalId;
      }
    }

    if (!patientId || !doctorId || !appointmentDate || !startTime || !endTime || !reason) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: patientId, doctorId, appointmentDate, startTime, endTime, reason.",
      });
    }

    // Validate Doctor existence and resolve hospitalId
    const doctorObj = await Doctor.findById(doctorId);
    if (!doctorObj) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found.",
      });
    }

    if (!hospitalId) hospitalId = doctorObj.hospitalId;
    if (!departmentId && doctorObj.departmentId) departmentId = doctorObj.departmentId;

    // Normalize date to ISO start of day for accurate comparison
    const parsedDate = new Date(appointmentDate);
    parsedDate.setUTCHours(0, 0, 0, 0);

    // Prevent Double-Booking: check for active appointment at same slot
    const doubleBookingCheck = await Appointment.findOne({
      doctorId,
      appointmentDate: parsedDate,
      startTime: startTime.trim(),
      status: { $in: ["pending", "confirmed"] },
    });

    if (doubleBookingCheck) {
      return res.status(400).json({
        success: false,
        message: "Doctor is already booked for this date and time slot. Please select another time.",
      });
    }

    // Compute server-side verified consultation fee
    const consultationFee = getAppointmentPrice(doctorObj, appointmentType || "in_person");

    const appointment = new Appointment({
      patientId,
      doctorId,
      hospitalId,
      departmentId,
      appointmentDate: parsedDate,
      startTime: startTime.trim(),
      endTime: endTime.trim(),
      appointmentType: appointmentType || "in_person",
      consultationFee,
      reason: reason.trim(),
      symptoms: symptoms || [],
      status: "pending",
    });

    await appointment.save();

    return res.status(201).json({
      success: true,
      message: "Appointment booked successfully.",
      data: appointment,
    });
  } catch (error) {
    console.error("createAppointment error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to book appointment.",
    });
  }
};

/**
 * @route   GET /api/appointments
 * @desc    Get paginated, filtered list of appointments
 * @access  Private
 */
const getAppointments = async (req, res) => {
  try {
    const filter = {};

    // Role-based scope filtering
    if (req.user.role === "patient") {
      const patient = await Patient.findOne({ userId: req.user._id });
      if (!patient) {
        return res.status(200).json({
          success: true,
          data: [],
          pagination: { total: 0, page: 1, limit: 10, totalPages: 1, hasNextPage: false, hasPrevPage: false },
        });
      }
      filter.patientId = patient._id;
    } else if (req.user.role === "doctor") {
      const doctor = await Doctor.findOne({ userId: req.user._id });
      if (!doctor) {
        return res.status(403).json({
          success: false,
          message: "Doctor profile required.",
        });
      }
      filter.doctorId = doctor._id;
    } else if (req.user.role === "hospital_admin") {
      const hospital = await Hospital.findOne({ adminId: req.user._id });
      if (!hospital) {
        return res.status(403).json({
          success: false,
          message: "Hospital admin is not linked to any hospital.",
        });
      }
      filter.hospitalId = hospital._id;
    }

    // Query parameters filtering
    if (req.query.status) filter.status = req.query.status;
    if (req.query.appointmentType) filter.appointmentType = req.query.appointmentType;
    if (req.query.appointmentDate) {
      const parsedDate = new Date(req.query.appointmentDate);
      parsedDate.setUTCHours(0, 0, 0, 0);
      filter.appointmentDate = parsedDate;
    }

    const searchFields = ["reason", "notes"];
    const populateOptions = [
      {
        path: "patientId",
        populate: { path: "userId", select: "firstName lastName email phone" },
      },
      {
        path: "doctorId",
        populate: { path: "userId", select: "firstName lastName specialization" },
      },
      { path: "hospitalId", select: "name city state" },
      { path: "departmentId", select: "name" },
    ];

    const result = await buildQueryResult(Appointment, filter, req.query, searchFields, populateOptions);

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("getAppointments error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch appointments.",
    });
  }
};

/**
 * @route   GET /api/appointments/:id
 * @desc    Get single appointment details
 * @access  Private
 */
const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate({
        path: "patientId",
        populate: { path: "userId", select: "firstName lastName email phone gender dateOfBirth" },
      })
      .populate({
        path: "doctorId",
        populate: { path: "userId", select: "firstName lastName specialization" },
      })
      .populate("hospitalId", "name city state address phone")
      .populate("departmentId", "name");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    const authCheck = await checkAppointmentAccess(req.user, appointment);
    if (!authCheck.allowed) {
      return res.status(403).json({
        success: false,
        message: `Access denied. ${authCheck.reason}`,
      });
    }

    return res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    console.error("getAppointmentById error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch appointment details.",
    });
  }
};

/**
 * @route   PATCH /api/appointments/:id
 * @desc    Update appointment status / notes according to lifecycle rules
 * @access  Private
 */
const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    const authCheck = await checkAppointmentAccess(req.user, appointment);
    if (!authCheck.allowed) {
      return res.status(403).json({
        success: false,
        message: `Access denied. ${authCheck.reason}`,
      });
    }

    const { status, cancellationReason, notes, startTime, endTime, appointmentDate } = req.body;
    const userRole = req.user.role;

    // State transition rules per role
    if (userRole === "patient") {
      // Patients can only cancel their own appointment
      if (status && status !== "cancelled") {
        return res.status(403).json({
          success: false,
          message: "Patients can only cancel appointments. Status changes to confirmed or completed must be performed by the doctor or clinic.",
        });
      }
      if (status === "cancelled") {
        appointment.status = "cancelled";
        if (cancellationReason) appointment.cancellationReason = cancellationReason;
      }
    } else if (userRole === "doctor" || userRole === "hospital_admin" || userRole === "super_admin") {
      if (status) appointment.status = status;
      if (cancellationReason) appointment.cancellationReason = cancellationReason;
      if (notes !== undefined) appointment.notes = notes;
      if (startTime) appointment.startTime = startTime;
      if (endTime) appointment.endTime = endTime;
      if (appointmentDate) appointment.appointmentDate = new Date(appointmentDate);
    }

    await appointment.save();

    return res.status(200).json({
      success: true,
      message: "Appointment updated successfully.",
      data: appointment,
    });
  } catch (error) {
    console.error("updateAppointment error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update appointment.",
    });
  }
};

/**
 * @route   DELETE /api/appointments/:id
 * @desc    Cancel or delete appointment
 * @access  Private
 */
const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    const authCheck = await checkAppointmentAccess(req.user, appointment);
    if (!authCheck.allowed) {
      return res.status(403).json({
        success: false,
        message: `Access denied. ${authCheck.reason}`,
      });
    }

    // Cancel appointment status
    appointment.status = "cancelled";
    if (req.body.cancellationReason) {
      appointment.cancellationReason = req.body.cancellationReason;
    }
    await appointment.save();

    return res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully.",
      data: appointment,
    });
  } catch (error) {
    console.error("deleteAppointment error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to cancel appointment.",
    });
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
};
