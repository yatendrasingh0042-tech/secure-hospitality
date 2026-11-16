const User = require("../models/User");

/**
 * Helper to map contact subdocument for frontend response
 */
const formatContact = (c) => ({
  id: c._id ? c._id.toString() : c.id,
  _id: c._id ? c._id.toString() : c.id,
  name: c.name || "",
  relationship: c.relationship || c.relation || "",
  relation: c.relationship || c.relation || "",
  phone: c.phone || "",
  createdAt: c.createdAt || null,
  updatedAt: c.updatedAt || null,
});

/**
 * @route   GET /api/emergency-contacts
 * @desc    Get all emergency contacts for authenticated user
 * @access  Private (Protected by requireAuth)
 */
const getEmergencyContacts = async (req, res) => {
  try {
    const contacts = (req.user.emergencyContacts || []).map(formatContact);
    return res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    console.error("getEmergencyContacts error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch emergency contacts.",
    });
  }
};

/**
 * @route   POST /api/emergency-contacts
 * @desc    Add a new emergency contact for authenticated user
 * @access  Private (Protected by requireAuth)
 */
const addEmergencyContact = async (req, res) => {
  try {
    const { name, relationship, relation, phone } = req.body;

    const contactName = name ? name.trim() : "";
    const contactRel = (relationship || relation || "").trim();
    const contactPhone = phone ? phone.trim() : "";

    if (!contactName || !contactRel || !contactPhone) {
      return res.status(400).json({
        success: false,
        message: "Please provide contact name, relationship, and phone number.",
      });
    }

    const phoneRegex = /^[0-9+\-\s()]{7,20}$/;
    if (!phoneRegex.test(contactPhone)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid phone number.",
      });
    }

    const user = req.user;
    if (!Array.isArray(user.emergencyContacts)) {
      user.emergencyContacts = [];
    }

    const newContactSubdoc = {
      name: contactName,
      relationship: contactRel,
      phone: contactPhone,
    };

    user.emergencyContacts.push(newContactSubdoc);
    await user.save();

    const addedContact = user.emergencyContacts[user.emergencyContacts.length - 1];
    const formattedAdded = formatContact(addedContact);
    const allContacts = user.emergencyContacts.map(formatContact);

    return res.status(201).json({
      success: true,
      message: "Emergency contact added successfully.",
      data: formattedAdded,
      contacts: allContacts,
    });
  } catch (error) {
    console.error("addEmergencyContact error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add emergency contact.",
    });
  }
};

/**
 * @route   PATCH /api/emergency-contacts/:id
 * @desc    Update an existing emergency contact for authenticated user
 * @access  Private (Protected by requireAuth)
 */
const updateEmergencyContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, relationship, relation, phone } = req.body;

    const user = req.user;
    const contactSubdoc = user.emergencyContacts.id(id);

    if (!contactSubdoc) {
      return res.status(404).json({
        success: false,
        message: "Emergency contact not found.",
      });
    }

    if (name !== undefined) contactSubdoc.name = name.trim();
    if (relationship !== undefined || relation !== undefined) {
      contactSubdoc.relationship = (relationship || relation || "").trim();
    }
    if (phone !== undefined) {
      const trimmedPhone = phone.trim();
      const phoneRegex = /^[0-9+\-\s()]{7,20}$/;
      if (!phoneRegex.test(trimmedPhone)) {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid phone number.",
        });
      }
      contactSubdoc.phone = trimmedPhone;
    }

    await user.save();

    const formattedUpdated = formatContact(contactSubdoc);
    const allContacts = user.emergencyContacts.map(formatContact);

    return res.status(200).json({
      success: true,
      message: "Emergency contact updated successfully.",
      data: formattedUpdated,
      contacts: allContacts,
    });
  } catch (error) {
    console.error("updateEmergencyContact error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update emergency contact.",
    });
  }
};

/**
 * @route   DELETE /api/emergency-contacts/:id
 * @desc    Delete an emergency contact for authenticated user
 * @access  Private (Protected by requireAuth)
 */
const deleteEmergencyContact = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const contactSubdoc = user.emergencyContacts.id(id);
    if (!contactSubdoc) {
      return res.status(404).json({
        success: false,
        message: "Emergency contact not found.",
      });
    }

    user.emergencyContacts.pull(id);
    await user.save();

    const allContacts = user.emergencyContacts.map(formatContact);

    return res.status(200).json({
      success: true,
      message: "Emergency contact deleted successfully.",
      contacts: allContacts,
    });
  } catch (error) {
    console.error("deleteEmergencyContact error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete emergency contact.",
    });
  }
};

module.exports = {
  getEmergencyContacts,
  addEmergencyContact,
  updateEmergencyContact,
  deleteEmergencyContact,
};
