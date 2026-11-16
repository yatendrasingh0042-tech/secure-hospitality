const mongoose = require("mongoose");
const User = require("../models/User");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Hospital = require("../models/Hospital");
const Appointment = require("../models/Appointment");
const Pharmacy = require("../models/Pharmacy");
const Medicine = require("../models/Medicine");
const Order = require("../models/Order");
const Ambulance = require("../models/Ambulance");
const AmbulanceRequest = require("../models/AmbulanceRequest");
const Notification = require("../models/Notification");

/**
 * Helper to build Date Range match query
 */
const buildDateMatch = (startDate, endDate, field = "createdAt") => {
  const match = {};
  if (startDate || endDate) {
    match[field] = {};
    if (startDate) match[field].$gte = new Date(startDate);
    if (endDate) match[field].$lte = new Date(endDate);
  }
  return match;
};

/**
 * Helper to resolve hospitalId for hospital_admin role
 */
const getScopedHospitalId = async (user) => {
  if (user.role === "hospital_admin") {
    const hospital = await Hospital.findOne({ adminId: user._id });
    return hospital ? hospital._id : null;
  }
  return null;
};

/**
 * @route   GET /api/admin/dashboard
 * @desc    Get high-level dashboard overview stats
 * @access  Private (super_admin, hospital_admin)
 */
const getDashboardOverview = async (req, res) => {
  try {
    const scopedHospitalId = await getScopedHospitalId(req.user);
    const dateMatch = buildDateMatch(req.query.startDate, req.query.endDate);

    let hospitalFilter = {};
    let appointmentFilter = { ...dateMatch };
    let ambulanceFilter = {};
    let requestFilter = { ...dateMatch };

    if (scopedHospitalId) {
      hospitalFilter._id = scopedHospitalId;
      appointmentFilter.hospitalId = scopedHospitalId;
      ambulanceFilter.hospitalId = scopedHospitalId;
      requestFilter.assignedHospitalId = scopedHospitalId;
    }

    const [
      totalUsers,
      totalPatients,
      totalDoctors,
      totalHospitals,
      appointmentStats,
      orderStats,
      ambulanceStats,
      notificationStats,
    ] = await Promise.all([
      scopedHospitalId
        ? Doctor.countDocuments({ hospitalId: scopedHospitalId })
        : User.countDocuments(dateMatch),
      Patient.countDocuments(dateMatch),
      Doctor.countDocuments(scopedHospitalId ? { hospitalId: scopedHospitalId } : {}),
      Hospital.countDocuments(hospitalFilter),
      Appointment.aggregate([
        { $match: appointmentFilter },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      Order.aggregate([
        { $match: dateMatch },
        {
          $group: {
            _id: "$orderStatus",
            count: { $sum: 1 },
            totalRevenue: { $sum: "$total" },
          },
        },
      ]),
      Ambulance.aggregate([
        { $match: ambulanceFilter },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      Notification.aggregate([
        { $match: dateMatch },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
    ]);

    // Format appointment summary
    const appointmentsByStatus = appointmentStats.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    const totalAppointments = appointmentStats.reduce((acc, curr) => acc + curr.count, 0);

    // Format order revenue summary
    const totalRevenue = orderStats.reduce((acc, curr) => acc + (curr.totalRevenue || 0), 0);
    const totalOrders = orderStats.reduce((acc, curr) => acc + curr.count, 0);

    return res.status(200).json({
      success: true,
      data: {
        roleScope: req.user.role,
        scopedHospitalId,
        overview: {
          totalUsers: scopedHospitalId ? totalDoctors : totalUsers,
          totalPatients,
          totalDoctors,
          totalHospitals,
          totalAppointments,
          totalOrders,
          totalRevenue,
        },
        appointmentsSummary: {
          total: totalAppointments,
          byStatus: appointmentsByStatus,
        },
        ordersSummary: {
          totalOrders,
          totalRevenue,
        },
        ambulancesSummary: ambulanceStats.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
      },
    });
  } catch (error) {
    console.error("getDashboardOverview error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard overview statistics.",
    });
  }
};

/**
 * @route   GET /api/admin/stats/users
 * @desc    Get user statistics and registration trends
 * @access  Private (super_admin)
 */
const getUserStats = async (req, res) => {
  try {
    const dateMatch = buildDateMatch(req.query.startDate, req.query.endDate);

    const userFacets = await User.aggregate([
      { $match: dateMatch },
      {
        $facet: {
          byRole: [{ $group: { _id: "$role", count: { $sum: 1 } } }],
          byStatus: [{ $group: { _id: "$isActive", count: { $sum: 1 } } }],
          registrationTrends: [
            {
              $group: {
                _id: {
                  year: { $year: "$createdAt" },
                  month: { $month: "$createdAt" },
                },
                count: { $sum: 1 },
              },
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
          ],
          totalUsers: [{ $count: "total" }],
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      data: userFacets[0],
    });
  } catch (error) {
    console.error("getUserStats error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user statistics.",
    });
  }
};

/**
 * @route   GET /api/admin/stats/patients
 * @desc    Get patient demographic statistics
 * @access  Private (super_admin, hospital_admin)
 */
const getPatientStats = async (req, res) => {
  try {
    const dateMatch = buildDateMatch(req.query.startDate, req.query.endDate);

    const patientFacets = await Patient.aggregate([
      { $match: dateMatch },
      {
        $facet: {
          byGender: [{ $group: { _id: "$gender", count: { $sum: 1 } } }],
          byBloodGroup: [{ $group: { _id: "$bloodGroup", count: { $sum: 1 } } }],
          totalPatients: [{ $count: "total" }],
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      data: patientFacets[0],
    });
  } catch (error) {
    console.error("getPatientStats error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch patient statistics.",
    });
  }
};

/**
 * @route   GET /api/admin/stats/doctors
 * @desc    Get doctor statistics and specialization breakdown
 * @access  Private (super_admin, hospital_admin)
 */
const getDoctorStats = async (req, res) => {
  try {
    const scopedHospitalId = await getScopedHospitalId(req.user);
    const filter = scopedHospitalId ? { hospitalId: scopedHospitalId } : {};

    const doctorFacets = await Doctor.aggregate([
      { $match: filter },
      {
        $facet: {
          bySpecialization: [{ $group: { _id: "$specialization", count: { $sum: 1 } } }],
          byVerificationStatus: [{ $group: { _id: "$verificationStatus", count: { $sum: 1 } } }],
          experienceStats: [
            {
              $group: {
                _id: null,
                avgExperience: { $avg: "$experience" },
                minExperience: { $min: "$experience" },
                maxExperience: { $max: "$experience" },
              },
            },
          ],
          totalDoctors: [{ $count: "total" }],
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      data: doctorFacets[0],
    });
  } catch (error) {
    console.error("getDoctorStats error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch doctor statistics.",
    });
  }
};

/**
 * @route   GET /api/admin/stats/hospitals
 * @desc    Get hospital distribution and verification metrics
 * @access  Private (super_admin, hospital_admin)
 */
const getHospitalStats = async (req, res) => {
  try {
    const scopedHospitalId = await getScopedHospitalId(req.user);
    const filter = scopedHospitalId ? { _id: scopedHospitalId } : {};

    const hospitalFacets = await Hospital.aggregate([
      { $match: filter },
      {
        $facet: {
          byVerificationStatus: [{ $group: { _id: "$verificationStatus", count: { $sum: 1 } } }],
          byEmergencyAvailable: [{ $group: { _id: "$emergencyAvailable", count: { $sum: 1 } } }],
          byCity: [{ $group: { _id: "$city", count: { $sum: 1 } } }],
          byState: [{ $group: { _id: "$state", count: { $sum: 1 } } }],
          totalHospitals: [{ $count: "total" }],
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      data: hospitalFacets[0],
    });
  } catch (error) {
    console.error("getHospitalStats error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch hospital statistics.",
    });
  }
};

/**
 * @route   GET /api/admin/stats/appointments
 * @desc    Get appointment lifecycle analytics
 * @access  Private (super_admin, hospital_admin)
 */
const getAppointmentStats = async (req, res) => {
  try {
    const scopedHospitalId = await getScopedHospitalId(req.user);
    const dateMatch = buildDateMatch(req.query.startDate, req.query.endDate, "appointmentDate");

    const filter = { ...dateMatch };
    if (scopedHospitalId) filter.hospitalId = scopedHospitalId;

    const appointmentFacets = await Appointment.aggregate([
      { $match: filter },
      {
        $facet: {
          byStatus: [{ $group: { _id: "$status", count: { $sum: 1 } } }],
          byType: [{ $group: { _id: "$appointmentType", count: { $sum: 1 } } }],
          bookingTrends: [
            {
              $group: {
                _id: "$appointmentDate",
                count: { $sum: 1 },
              },
            },
            { $sort: { _id: 1 } },
            { $limit: 30 },
          ],
          totalAppointments: [{ $count: "total" }],
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      data: appointmentFacets[0],
    });
  } catch (error) {
    console.error("getAppointmentStats error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch appointment statistics.",
    });
  }
};

/**
 * @route   GET /api/admin/stats/pharmacy
 * @desc    Get medicine sales, revenue pipeline, and stock analytics
 * @access  Private (super_admin, hospital_admin)
 */
const getPharmacyStats = async (req, res) => {
  try {
    const dateMatch = buildDateMatch(req.query.startDate, req.query.endDate);

    const [orderFacets, medicineFacets] = await Promise.all([
      Order.aggregate([
        { $match: dateMatch },
        {
          $facet: {
            byOrderStatus: [{ $group: { _id: "$orderStatus", count: { $sum: 1 } } }],
            byPaymentStatus: [
              {
                $group: {
                  _id: "$paymentStatus",
                  count: { $sum: 1 },
                  revenue: { $sum: "$total" },
                },
              },
            ],
            revenueMetrics: [
              {
                $group: {
                  _id: null,
                  totalRevenue: { $sum: "$total" },
                  avgOrderValue: { $avg: "$total" },
                  maxOrderValue: { $max: "$total" },
                },
              },
            ],
            totalOrders: [{ $count: "total" }],
          },
        },
      ]),
      Medicine.aggregate([
        {
          $facet: {
            byStatus: [{ $group: { _id: "$status", count: { $sum: 1 } } }],
            byCategory: [{ $group: { _id: "$category", count: { $sum: 1 } } }],
            stockAlerts: [
              { $match: { stock: { $lte: 10 } } },
              { $project: { name: 1, stock: 1, status: 1, price: 1 } },
              { $limit: 10 },
            ],
            totalMedicines: [{ $count: "total" }],
          },
        },
      ]),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        orders: orderFacets[0],
        medicines: medicineFacets[0],
      },
    });
  } catch (error) {
    console.error("getPharmacyStats error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch pharmacy statistics.",
    });
  }
};

/**
 * @route   GET /api/admin/stats/ambulances
 * @desc    Get ambulance availability and emergency dispatch metrics
 * @access  Private (super_admin, hospital_admin)
 */
const getAmbulanceStats = async (req, res) => {
  try {
    const scopedHospitalId = await getScopedHospitalId(req.user);
    const dateMatch = buildDateMatch(req.query.startDate, req.query.endDate, "requestedAt");

    const ambFilter = scopedHospitalId ? { hospitalId: scopedHospitalId } : {};
    const reqFilter = { ...dateMatch };
    if (scopedHospitalId) reqFilter.assignedHospitalId = scopedHospitalId;

    const [ambulanceFacets, requestFacets] = await Promise.all([
      Ambulance.aggregate([
        { $match: ambFilter },
        {
          $facet: {
            byStatus: [{ $group: { _id: "$status", count: { $sum: 1 } } }],
            byType: [{ $group: { _id: "$type", count: { $sum: 1 } } }],
            totalAmbulances: [{ $count: "total" }],
          },
        },
      ]),
      AmbulanceRequest.aggregate([
        { $match: reqFilter },
        {
          $facet: {
            byStatus: [{ $group: { _id: "$status", count: { $sum: 1 } } }],
            byEmergencyType: [{ $group: { _id: "$emergencyType", count: { $sum: 1 } } }],
            totalRequests: [{ $count: "total" }],
          },
        },
      ]),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        fleet: ambulanceFacets[0],
        requests: requestFacets[0],
      },
    });
  } catch (error) {
    console.error("getAmbulanceStats error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch ambulance statistics.",
    });
  }
};

/**
 * @route   GET /api/admin/stats/notifications
 * @desc    Get notification delivery analytics
 * @access  Private (super_admin)
 */
const getNotificationStats = async (req, res) => {
  try {
    const dateMatch = buildDateMatch(req.query.startDate, req.query.endDate);

    const notificationFacets = await Notification.aggregate([
      { $match: dateMatch },
      {
        $facet: {
          byChannel: [{ $group: { _id: "$channel", count: { $sum: 1 } } }],
          byType: [{ $group: { _id: "$type", count: { $sum: 1 } } }],
          byStatus: [{ $group: { _id: "$status", count: { $sum: 1 } } }],
          totalNotifications: [{ $count: "total" }],
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      data: notificationFacets[0],
    });
  } catch (error) {
    console.error("getNotificationStats error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch notification statistics.",
    });
  }
};

module.exports = {
  getDashboardOverview,
  getUserStats,
  getPatientStats,
  getDoctorStats,
  getHospitalStats,
  getAppointmentStats,
  getPharmacyStats,
  getAmbulanceStats,
  getNotificationStats,
};
