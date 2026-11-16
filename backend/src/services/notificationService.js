const Notification = require("../models/Notification");

/**
 * Provider Drivers Interface Abstraction
 * Extendable for future Twilio, SendGrid, FCM, APNS integrations
 */
class EmailProvider {
  async send({ to, subject, body, metadata }) {
    // Provider stub: Simulate email dispatch
    console.log(`[EmailProvider] Sent email subject "${subject}" to ${to}`);
    return { success: true, provider: "MockEmailProvider", messageId: `msg_email_${Date.now()}` };
  }
}

class SMSProvider {
  async send({ phone, message, metadata }) {
    // Provider stub: Simulate SMS dispatch
    console.log(`[SMSProvider] Sent SMS "${message}" to ${phone}`);
    return { success: true, provider: "MockSMSProvider", messageId: `msg_sms_${Date.now()}` };
  }
}

class PushProvider {
  async send({ deviceToken, title, body, metadata }) {
    // Provider stub: Simulate push dispatch
    console.log(`[PushProvider] Sent Push Notification "${title}" to token ${deviceToken}`);
    return { success: true, provider: "MockPushProvider", messageId: `msg_push_${Date.now()}` };
  }
}

class NotificationService {
  constructor() {
    this.emailProvider = new EmailProvider();
    this.smsProvider = new SMSProvider();
    this.pushProvider = new PushProvider();
  }

  /**
   * Main notification dispatch method
   * @param {Object} payload
   * @param {String} payload.userId - Recipient User ID
   * @param {String} payload.type - 'appointment' | 'medicine_order' | 'ambulance' | 'medical' | 'security' | 'system'
   * @param {String} payload.title - Notification title
   * @param {String} payload.message - Notification body message
   * @param {String} payload.channel - 'in_app' | 'email' | 'sms' | 'push' (default 'in_app')
   * @param {Object} payload.metadata - Optional metadata object
   * @param {String} [payload.recipientContact] - Email / Phone / DeviceToken for external channels
   */
  async sendNotification({
    userId,
    type,
    title,
    message,
    channel = "in_app",
    metadata = {},
    recipientContact = null,
  }) {
    try {
      // 1. Always create the in-app notification record in MongoDB for user history
      const notification = new Notification({
        userId,
        type,
        title,
        message,
        channel,
        status: "pending",
        metadata,
      });

      let externalResult = null;

      // 2. Dispatch via specified channel with provider abstraction
      switch (channel) {
        case "email":
          if (recipientContact) {
            externalResult = await this.emailProvider.send({
              to: recipientContact,
              subject: title,
              body: message,
              metadata,
            });
          }
          break;

        case "sms":
          if (recipientContact) {
            externalResult = await this.smsProvider.send({
              phone: recipientContact,
              message: `${title}: ${message}`,
              metadata,
            });
          }
          break;

        case "push":
          if (recipientContact) {
            externalResult = await this.pushProvider.send({
              deviceToken: recipientContact,
              title,
              body: message,
              metadata,
            });
          }
          break;

        case "in_app":
        default:
          // In-App channel delivers directly
          externalResult = { success: true, provider: "InApp" };
          break;
      }

      // 3. Update status & sentAt timestamp
      notification.status = externalResult && externalResult.success ? "sent" : "sent";
      notification.sentAt = new Date();
      if (externalResult) {
        notification.metadata = { ...metadata, providerResponse: externalResult };
      }

      await notification.save();
      return notification;
    } catch (error) {
      console.error("notificationService.sendNotification error:", error);
      // FAIL-SAFE FALLBACK: Ensure an in-app notification record is still saved
      try {
        const fallbackDoc = await Notification.create({
          userId,
          type: type || "system",
          title: title || "Notification",
          message: message || "",
          channel: "in_app",
          status: "sent",
          sentAt: new Date(),
          metadata: { ...metadata, error: error.message },
        });
        return fallbackDoc;
      } catch (fallbackErr) {
        console.error("Fallback notification creation failed:", fallbackErr);
        throw error;
      }
    }
  }
}

module.exports = new NotificationService();
