const assert = require("assert");

console.log("=================================================");
console.log("RUNNING VERCEL & SERVERLESS COMPATIBILITY TESTS...");
console.log("=================================================");

// 1. Verify backend/src/server.js exports
const serverModule = require("../server");
assert(
  typeof serverModule === "function",
  "FAIL: Default export of server.js must be a function (Express application)"
);
console.log("  ✓ PASSED: Default export of server.js is a function (Express app)");

assert(
  typeof serverModule.app === "function",
  "FAIL: serverModule.app must be a function"
);
console.log("  ✓ PASSED: Named export 'app' is present and is a function");

// 2. Verify backend/index.js exports
const indexModule = require("../../index");
assert(
  typeof indexModule === "function",
  "FAIL: backend/index.js default export must be a function"
);
console.log("  ✓ PASSED: backend/index.js exports Express function");

// 3. Verify backend/api/index.js exports
const apiModule = require("../../api/index");
assert(
  typeof apiModule === "function",
  "FAIL: backend/api/index.js default export must be a function"
);
console.log("  ✓ PASSED: backend/api/index.js exports Express function");

// 4. Test Serverless Request Simulation on /api/health
const mockReq = {
  method: "GET",
  url: "/api/health",
  headers: { host: "localhost:5050" },
  query: {},
  params: {},
};

let responseStatus = null;
let responseHeaders = {};
let responseBody = null;

const mockRes = {
  statusCode: 200,
  setHeader(name, val) {
    responseHeaders[name.toLowerCase()] = val;
  },
  getHeader(name) {
    return responseHeaders[name.toLowerCase()];
  },
  status(code) {
    this.statusCode = code;
    responseStatus = code;
    return this;
  },
  json(data) {
    responseBody = data;
    this.finish();
  },
  send(data) {
    responseBody = data;
    this.finish();
  },
  end() {
    this.finish();
  },
  finish() {
    // Assert health structure
    assert(responseBody !== null, "FAIL: Response body must not be null");
    assert("status" in responseBody, "FAIL: Response must include 'status'");
    assert("database" in responseBody, "FAIL: Response must include 'database'");
    assert("environment" in responseBody, "FAIL: Response must include 'environment'");
    assert("timestamp" in responseBody, "FAIL: Response must include 'timestamp'");
    console.log(`  ✓ PASSED: /api/health responded with HTTP ${this.statusCode}`);
    console.log(`    Status: ${responseBody.status}, Database: ${responseBody.database}, Env: ${responseBody.environment}`);
    console.log("=================================================");
    console.log("ALL VERCEL & SERVERLESS TESTS PASSED CLEANLY!");
    console.log("=================================================");
    process.exit(0);
  },
};

serverModule(mockReq, mockRes);
