const Ambulance = require("../models/Ambulance");
const Hospital = require("../models/Hospital");
const { buildQueryResult } = require("../utils/queryHelper");

/**
 * @route   POST /api/ambulances
 * @desc    Create a new ambulance entry
 * @access  Private (super_admin, hospital_admin)
 */
const createAmbulance = async (req, res) => {
  try {
    const { hospitalId, vehicleNumber, driver, contact, type, equipment, currentLocation } = req.body;

    if (!vehicleNumber || !contact) {
      return res.status(400).json({
        success: false,
        message: "vehicleNumber and contact number are required.",
      });
    }

    let resolvedHospitalId = hospitalId;
    if (req.user.role === "hospital_admin") {
      const hospital = await Hospital.findOne({ adminId: req.user._id });
      if (hospital) resolvedHospitalId = hospital._id;
    }

    if (!resolvedHospitalId) {
      return res.status(400).json({
        success: false,
        message: "hospitalId is required.",
      });
    }

    const existing = await Ambulance.findOne({ vehicleNumber: vehicleNumber.trim() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "An ambulance with this vehicle registration number already exists.",
      });
    }

    const ambulance = new Ambulance({
      hospitalId: resolvedHospitalId,
      vehicleNumber: vehicleNumber.trim(),
      driver: driver || {},
      contact: contact.trim(),
      type: type || "basic_life_support",
      equipment: equipment || [],
      currentLocation: currentLocation || { type: "Point", coordinates: [0, 0] },
      status: "available",
      availability: true,
    });

    await ambulance.save();

    return res.status(201).json({
      success: true,
      message: "Ambulance registered successfully.",
      data: ambulance,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Vehicle number already registered.",
      });
    }
    console.error("createAmbulance error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to register ambulance.",
    });
  }
};

/**
 * @route   GET /api/ambulances/available
 * @desc    Get available ambulances (Supports geo-location proximity search)
 * @access  Public / Private
 */
const getAvailableAmbulances = async (req, res) => {
  try {
    const { lat, lng, type, maxDistance = 50000 } = req.query; // maxDistance in meters (default 50km)
    const filter = {
      availability: true,
      status: "available",
    };

    if (type) filter.type = type;

    // Optional 2dsphere near query if coordinates provided
    if (lat && lng) {
      filter.currentLocation = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: parseInt(maxDistance, 10),
        },
      };
    }

    const ambulances = await Ambulance.find(filter)
      .populate("hospitalId", "name phone address city state location emergencyAvailable")
      .limit(20);

    return res.status(200).json({
      success: true,
      count: ambulances.length,
      data: ambulances,
      trackingNote: "Location tracking architecture prepared. Real-time updates delivered via REST location updates / socket event bus.",
    });
  } catch (error) {
    console.error("getAvailableAmbulances error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch available ambulances.",
    });
  }
};

/**
 * @route   GET /api/ambulances
 * @desc    Get paginated list of ambulances
 * @access  Private
 */
const getAmbulances = async (req, res) => {
  try {
    const filter = {};

    if (req.user.role === "hospital_admin") {
      const hospital = await Hospital.findOne({ adminId: req.user._id });
      if (hospital) filter.hospitalId = hospital._id;
    }

    if (req.query.status) filter.status = req.query.status;
    if (req.query.type) filter.type = req.query.type;

    const populateOptions = [{ path: "hospitalId", select: "name city state" }];
    const searchFields = ["vehicleNumber", "contact"];

    const result = await buildQueryResult(Ambulance, filter, req.query, searchFields, populateOptions);

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("getAmbulances error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch ambulances.",
    });
  }
};

/**
 * @route   PATCH /api/ambulances/:id/location
 * @desc    Update ambulance GPS location coordinates (Real-time tracking architecture)
 * @access  Private (driver, hospital_admin, super_admin)
 */
const updateAmbulanceLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;

    if (lat === undefined || lng === undefined) {
      return res.status(400).json({
        success: false,
        message: "Latitude (lat) and Longitude (lng) coordinates are required.",
      });
    }

    const ambulance = await Ambulance.findById(req.params.id);
    if (!ambulance) {
      return res.status(404).json({
        success: false,
        message: "Ambulance not found.",
      });
    }

    ambulance.currentLocation = {
      type: "Point",
      coordinates: [parseFloat(lng), parseFloat(lat)],
    };

    await ambulance.save();

    return res.status(200).json({
      success: true,
      message: "Ambulance location updated successfully.",
      data: {
        id: ambulance._id,
        vehicleNumber: ambulance.vehicleNumber,
        currentLocation: ambulance.currentLocation,
        updatedAt: ambulance.updatedAt,
      },
    });
  } catch (error) {
    console.error("updateAmbulanceLocation error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update ambulance location.",
    });
  }
};

module.exports = {
  createAmbulance,
  getAvailableAmbulances,
  getAmbulances,
  updateAmbulanceLocation,
};
