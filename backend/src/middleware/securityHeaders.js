/**
 * Security HTTP Headers Middleware
 * Protects against XSS, clickjacking, MIME-sniffing, and transport vulnerabilities.
 */

const setSecurityHeaders = (req, res, next) => {
  // Prevent MIME type sniffing
  res.setHeader("X-Content-Type-Options", "nosniff");

  // Prevent Clickjacking framing
  res.setHeader("X-Frame-Options", "DENY");

  // Enable Browser XSS Filtering
  res.setHeader("X-XSS-Protection", "1; mode=block");

  // HTTP Strict Transport Security (HSTS) - only in production over HTTPS
  if (process.env.NODE_ENV === "production") {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  }

  // Content Security Policy (CSP)
  res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;");

  // Referrer Policy
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  // Disable cache for sensitive API responses
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  next();
};

module.exports = setSecurityHeaders;
