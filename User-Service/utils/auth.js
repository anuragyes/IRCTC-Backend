



const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {config} = require("../Config/index");
const { UnauthorizedError } = require("./errorTypes");



const generateAccessToken = (userId) => {
 
  if (!config.JWT_SECRET) {
    console.error(" JWT_SECRET is missing in config");
    throw new Error("JWT_SECRET not configured");
  }

  const payload = { id: userId };

  const token = jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: config.ACCESS_TOKEN_EXP
  });

 
  return token;
};


const generateRefreshToken = (userId) => {


  if (!config.JWT_REFRESH_SECRET) {
    console.error(" JWT_REFRESH_SECRET is missing in config");
    throw new Error("JWT_REFRESH_SECRET not configured");
  }

  const payload = {
    id: userId,
    jti: crypto.randomUUID()
  };

  const token = jwt.sign(payload, config.JWT_REFRESH_SECRET, {
    expiresIn: config.REFRESH_TOKEN_EXP
  });

 
  return token;
};

const verifyAccessToken = (token) => {

  const decoded = jwt.verify(token, config.JWT_SECRET);

  
  return decoded;
};


const verifyRefreshToken = (token) => {
  console.log("🔎 Verifying Refresh Token...");

  const decoded = jwt.verify(token, config.JWT_REFRESH_SECRET);

  console.log("✅ Refresh Token Verified. Payload:", decoded);
  return decoded;
};

const requireAuth = (req, res, next) => {
  
  try {
    const authHeader = req.headers.authorization;
  

    if (!authHeader) {
      console.error(" Authorization header missing");
      throw new UnauthorizedError("Authorization header missing");
    }

    if (!authHeader.startsWith("Bearer ")) {
      console.error(" Invalid Authorization format");
      throw new UnauthorizedError("Invalid authorization format");
    }

    const accessToken = authHeader.split(" ")[1];
    console.log("Extracted Access Token:", accessToken);

    if (!accessToken) {
      console.error(" Access token missing after split");
      throw new UnauthorizedError("Access token missing");
    }

    const payload = verifyAccessToken(accessToken);
    console.log("Decoded Payload:", payload);

    req.user = payload;
    console.log(" User attached to request:", req.user);

    next();
  } catch (error) {
    console.error(" Auth Error:", error.message);
    next(new UnauthorizedError("Invalid or expired access token"));
  }
};


module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  requireAuth
};
