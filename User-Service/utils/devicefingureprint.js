const crypto = require("crypto");

function getDeviceFingerprint(req) {
  const userAgent = req.headers["user-agent"] || "";
  const ip = req.ip || "";
  const accept = req.headers["accept"] || "";

  // Combine all fingerprint data
  const raw = `${userAgent}-${ip}-${accept}`;

  // Generate SHA256 hash
  return crypto
    .createHash("sha256")
    .update(raw)
    .digest("hex");
}

module.exports = { getDeviceFingerprint };
