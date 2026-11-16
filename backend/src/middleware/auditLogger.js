/**
 * Security Audit Logger Middleware
 * Captures structured audit logs for sensitive operations and state changes across the application.
 */

const auditLogger = (req, res, next) => {
  const startTime = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const ip = req.ip || req.headers["x-forwarded-for"] || (req.socket && req.socket.remoteAddress) || "127.0.0.1";
    const userId = req.user ? req.user._id : "anonymous";
    const role = req.user ? req.user.role : "public";

    const isMutation = ["POST", "PUT", "PATCH", "DELETE"].includes(req.method);
    const url = req.originalUrl || req.url || "";
    const isAuthOrAdmin = url.includes("/api/auth") || url.includes("/api/admin");

    if (isMutation || isAuthOrAdmin || res.statusCode >= 400) {
      console.log(
        `📝 AUDIT LOG | [${new Date().toISOString()}] | Status: ${res.statusCode} | Method: ${req.method} | URL: ${url} | User: ${userId} (${role}) | IP: ${ip} | Duration: ${duration}ms`
      );
    }
  });

  next();
};

module.exports = auditLogger;
