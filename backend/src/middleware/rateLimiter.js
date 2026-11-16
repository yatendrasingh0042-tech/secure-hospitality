/**
 * Sliding Window Rate Limiting Middleware
 * Prevents brute-force credential attacks, API abuse, and denial-of-service attempts.
 */

const rateLimitStore = new Map();

/**
 * Custom Rate Limiter Creator
 * @param {Object} options
 * @param {number} options.windowMs - Time window in milliseconds
 * @param {number} options.max - Max requests per IP in window
 * @param {string} options.message - Error response message
 */
const createRateLimiter = ({ windowMs = 15 * 60 * 1000, max = 100, message = "Too many requests. Please try again later." }) => {
  return (req, res, next) => {
    const isProduction = process.env.NODE_ENV === "production";

    // Bypass rate limiter ONLY in non-production environments
    if (!isProduction) {
      if (
        process.env.NODE_ENV === "test" ||
        process.env.DISABLE_RATE_LIMIT === "true" ||
        req.headers["x-test-bypass"] === "true"
      ) {
        return next();
      }
    }

    const ip = (req.headers && req.headers["x-forwarded-for"]) || (req.socket && req.socket.remoteAddress) || "127.0.0.1";
    const key = `${req.baseUrl || req.path}:${ip}`;
    const now = Date.now();

    // Clean expired store records when store size grows large
    if (rateLimitStore.size > 500) {
      for (const [sKey, sRecord] of rateLimitStore.entries()) {
        if (now - sRecord.startTime > windowMs) {
          rateLimitStore.delete(sKey);
        }
      }
    }

    let record = rateLimitStore.get(key);

    if (!record) {
      record = { count: 1, startTime: now };
      rateLimitStore.set(key, record);
    } else {
      if (now - record.startTime > windowMs) {
        record.count = 1;
        record.startTime = now;
      } else {
        record.count += 1;
      }
    }

    // Set rate limit headers
    res.setHeader("X-RateLimit-Limit", max);
    res.setHeader("X-RateLimit-Remaining", Math.max(0, max - record.count));
    res.setHeader("X-RateLimit-Reset", Math.ceil((record.startTime + windowMs) / 1000));

    if (record.count > max) {
      console.warn(`🛡️ Rate Limit Exceeded: IP [${ip}] on route [${req.originalUrl}] (${record.count}/${max} reqs)`);
      return res.status(429).json({
        success: false,
        message,
        retryAfterSeconds: Math.ceil((record.startTime + windowMs - now) / 1000),
      });
    }

    next();
  };
};

// 1. Auth Endpoint Rate Limiter (Production: 15 reqs/15m; Development: 100 reqs/15m)
const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === "production" ? 15 : 100,
  message: "Too many login/registration attempts. Please try again later.",
});

// 2. General API Rate Limiter (150 reqs per 15 mins)
const generalLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 150,
  message: "API rate limit exceeded. Please slow down your requests.",
});

// 3. Emergency Dispatch Rate Limiter (High throughput fail-safe limit: 60 reqs per minute)
const emergencyLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 60,
  message: "Too many emergency requests. Please call emergency services directly if urgent.",
});

module.exports = {
  createRateLimiter,
  authLimiter,
  generalLimiter,
  emergencyLimiter,
};

