/**
 * NoSQL Injection Sanitizer Middleware
 * Recursively inspects req.body, req.query, and req.params to strip or sanitize keys starting with '$' or containing '.'
 */

const sanitizeObject = (obj) => {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }

  const sanitized = {};
  for (const key of Object.keys(obj)) {
    // Strip keys starting with $ or containing . (NoSQL operator injection vector)
    if (key.startsWith("$") || key.includes(".")) {
      console.warn(`🛡️ Security Warning: Stripped prohibited NoSQL operator key '${key}' from input payload.`);
      continue;
    }

    sanitized[key] = sanitizeObject(obj[key]);
  }

  return sanitized;
};

const sanitizeInput = (req, res, next) => {
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }
  if (req.params) {
    req.params = sanitizeObject(req.params);
  }
  next();
};

module.exports = sanitizeInput;
