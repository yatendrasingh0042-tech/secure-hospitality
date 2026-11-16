const AmbulanceRequest = require("../models/AmbulanceRequest");
const Ambulance = require("../models/Ambulance");
const EmergencyEvent = require("../models/EmergencyEvent");
const Patient = require("../models/Patient");
const Hospital = require("../models/Hospital");
const { buildQueryResult } = require("../utils/queryHelper");

/**
 * @route   POST /api/ambulances/request
 * @desc    Submit emergency ambulance request (Fail-safe response architecture)
 * @access  Private / Public
 */
const requestAmbulance = async (req, res) => {
  try {
    const {
      pickupLocation,
      destination,
      emergencyType,
      symptoms,
      contactNumber,
      patientId,
    } = req.body;

    if (!emergencyType || !contactNumber || !pickupLocation || !pickupLocation.address) {
      return res.status(400).json({
        success: false,
        message: "Emergency request failed: pickupLocation address, emergencyType, and contactNumber are required.",
        failSafeInfo: {
          emergencyHelpline: "108 / 102",
          advice: "Please dial 108 or 102 immediately for urgent medical emergency assistance.",
        },
      });
    }

    let requesterId = req.user ? req.user._id : null;

    // Resolve patientId if not provided
    let resolvedPatientId = patientId;
    if (!resolvedPatientId && req.user && req.user.role === "patient") {
      const patient = await Patient.findOne({ userId: req.user._id });
      if (patient) resolvedPatientId = patient._id;
    }

    // Safely auto-search for nearest available ambulance
    let assignedAmbulance = null;
    const hasCoordinates =
      pickupLocation &&
      Array.isArray(pickupLocation.coordinates) &&
      pickupLocation.coordinates.length === 2 &&
      !isNaN(pickupLocation.coordinates[0]) &&
      !isNaN(pickupLocation.coordinates[1]);

    if (hasCoordinates) {
      try {
        const [lng, lat] = pickupLocation.coordinates;
        assignedAmbulance = await Ambulance.findOne({
          availability: true,
          status: "available",
          currentLocation: {
            $near: {
              $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
              $maxDistance: 50000,
            },
          },
        });
      } catch (geoErr) {
        // Fall back gracefully if 2dsphere near query fails
      }
    }

    if (!assignedAmbulance) {
      // Fallback search: any available ambulance
      assignedAmbulance = await Ambulance.findOne({ availability: true, status: "available" });
    }

    let initialStatus = "requested";
    let assignedAmbulanceId = null;
    let assignedHospitalId = null;

    if (assignedAmbulance) {
      assignedAmbulanceId = assignedAmbulance._id;
      assignedHospitalId = assignedAmbulance.hospitalId;
      initialStatus = "accepted";

      // Update ambulance status
      assignedAmbulance.availability = false;
      assignedAmbulance.status = "dispatched";
      await assignedAmbulance.save();
    }

    const request = new AmbulanceRequest({
      requesterId,
      patientId: resolvedPatientId,
      pickupLocation: {
        address: pickupLocation.address.trim(),
        coordinates: hasCoordinates ? pickupLocation.coordinates : [0, 0],
      },
      destination: destination || { address: "", coordinates: [0, 0] },
      emergencyType: emergencyType.trim(),
      symptoms: symptoms || [],
      contactNumber: contactNumber.trim(),
      assignedAmbulanceId,
      assignedHospitalId,
      status: initialStatus,
      requestedAt: new Date(),
      acceptedAt: assignedAmbulance ? new Date() : null,
    });

    await request.save();

    // Log Emergency Event for audit trail
    await EmergencyEvent.create({
      requestId: request._id,
      status: initialStatus,
      notes: assignedAmbulance
        ? `Auto-assigned ambulance ${assignedAmbulance.vehicleNumber}`
        : "Pending manual dispatch assignment",
      updatedBy: req.user ? req.user._id : null,
    });

    const isAssigned = Boolean(assignedAmbulance);

    return res.status(201).json({
      success: true,
      message: isAssigned
        ? `Emergency request accepted! Ambulance ${assignedAmbulance.vehicleNumber} dispatched.`
        : "Emergency request registered successfully. Dispatch team notified.",
      data: request,
      failSafeInfo: {
        assigned: isAssigned,
        emergencyHelpline: "108 / 102",
        advice: isAssigned
          ? "Ambulance is en-route. Please keep your phone reachable."
          : "Emergency team notified. If urgent, dial 108 / 102 emergency helpline directly.",
      },
    });
  } catch (error) {
    console.error("requestAmbulance error:", error);
    // FAIL-SAFE EMERGENCY RESPONSE: Return structured emergency helpline error
    return res.status(500).json({
      success: false,
      message: "Emergency service error. Please dial emergency helpline directly.",
      failSafeInfo: {
        emergencyHelpline: "108 / 102",
        advice: "Please call 108 or 102 immediately.",
      },
      error: error.message,
    });
  }
};

/**
 * @route   GET /api/ambulances/request/:id
 * @desc    Get emergency ambulance request details
 * @access  Private
 */
const getAmbulanceRequestById = async (req, res) => {
  try {
    const request = await AmbulanceRequest.findById(req.params.id)
      .populate("requesterId", "firstName lastName email phone")
      .populate({
        path: "patientId",
        populate: { path: "userId", select: "firstName lastName email phone" },
      })
      .populate("assignedAmbulanceId", "vehicleNumber driver contact type currentLocation status")
      .populate("assignedHospitalId", "name phone address city state");

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Ambulance request not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error) {
    console.error("getAmbulanceRequestById error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch ambulance request details.",
    });
  }
};

/**
 * @route   GET /api/ambulances/requests
 * @desc    Get list of ambulance requests (Filtered by user role)
 * @access  Private
 */
const getAmbulanceRequests = async (req, res) => {
  try {
    const filter = {};

    if (req.user.role === "patient") {
      filter.requesterId = req.user._id;
    } else if (req.user.role === "hospital_admin") {
      const hospital = await Hospital.findOne({ adminId: req.user._id });
      if (hospital) filter.assignedHospitalId = hospital._id;
    }

    if (req.query.status) filter.status = req.query.status;

    const populateOptions = [
      { path: "requesterId", select: "firstName lastName email phone" },
      { path: "assignedAmbulanceId", select: "vehicleNumber contact status" },
      { path: "assignedHospitalId", select: "name city state" },
    ];

    const result = await buildQueryResult(AmbulanceRequest, filter, req.query, [], populateOptions);

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("getAmbulanceRequests error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch ambulance requests.",
    });
  }
};

/**
 * @route   PATCH /api/ambulances/request/:id/status
 * @desc    Update emergency dispatch status & lifecycle state
 * @access  Private (hospital_admin, super_admin, doctor/driver)
 */
const updateRequestStatus = async (req, res) => {
  try {
    const { status, assignedAmbulanceId, cancellationReason, notes } = req.body;
    const request = await AmbulanceRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Ambulance request not found.",
      });
    }

    if (status) {
      request.status = status;
      if (status === "accepted" && !request.acceptedAt) {
        request.acceptedAt = new Date();
      }
      if (status === "completed") {
        request.completedAt = new Date();
      }
    }

    if (cancellationReason) request.cancellationReason = cancellationReason;

    // Manual ambulance assignment
    if (assignedAmbulanceId) {
      const ambulance = await Ambulance.findById(assignedAmbulanceId);
      if (ambulance) {
        request.assignedAmbulanceId = ambulance._id;
        request.assignedHospitalId = ambulance.hospitalId;

        if (status === "dispatched" || status === "accepted") {
          ambulance.availability = false;
          ambulance.status = "dispatched";
          await ambulance.save();
        }
      }
    }

    // Free ambulance when completed or cancelled
    if (["completed", "cancelled"].includes(status) && request.assignedAmbulanceId) {
      await Ambulance.findByIdAndUpdate(request.assignedAmbulanceId, {
        availability: true,
        status: "available",
      });
    }

    await request.save();

    // Log Emergency Event for audit trail
    await EmergencyEvent.create({
      requestId: request._id,
      status: request.status,
      notes: notes || `Status updated to ${request.status}`,
      updatedBy: req.user._id,
    });

    return res.status(200).json({
      success: true,
      message: `Emergency request status updated to '${request.status}'.`,
      data: request,
    });
  } catch (error) {
    console.error("updateRequestStatus error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update emergency request status.",
    });
  }
};

module.exports = {
  requestAmbulance,
  getAmbulanceRequestById,
  getAmbulanceRequests,
  updateRequestStatus,
};
