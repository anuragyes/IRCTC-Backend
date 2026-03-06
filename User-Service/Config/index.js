require("dotenv").config();

exports.config = {
  SERVICE_NAME: "User-Service",

  /* =========================
    Server Configuration
  ========================== */
  PORT: Number(process.env.PORT) || 4001,
  NODE_ENV: process.env.NODE_ENV || "development",
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
  CORS_ORIGIN: process.env.CORS_ORIGIN || "*",
  ALLOWED_ORIGINS:
    process.env.ALLOWED_ORIGINS || "http://localhost:4000",

  /* =========================
     📧 Email Configuration
  ========================== */
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  SMTP_HOST: process.env.SMTP_HOST || "smtp.gmail.com",
  SMTP_PORT: Number(process.env.SMTP_PORT) || 587,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  EMAIL_FROM: process.env.EMAIL_FROM,
  EMAIL_SEND: process.env.EMAIL_SEND === "true",

  /* =========================
     🔢 OTP Configuration
  ========================== */
  OTP_EXPIRATION: Number(process.env.OTP_EXPIRATION) || 5,
  OTP_TTL: Number(process.env.OTP_TTL) || 300,
  OTP_MAX_PER_HOUR: Number(process.env.OTP_MAX_PER_HOUR) || 5,
  ATTEMPT_MAX_OTP_VERIFICATION:
    Number(process.env.ATTEMPT_MAX_OTP_VERIFICATION) || 5,

  /* =========================
     🗄️ Database & Redis
  ========================== */
  DATABASE_URL:
    process.env.DATABASE_URL ||
    "postgresql://admin:irctcpass@localhost:5432/user_service",

  REDIS_URL:
    process.env.REDIS_URL || "redis://localhost:6379",

  REDIS_URL_TTL: Number(process.env.REDIS_URL_TTL) || 604800,

  /* =========================
     🔐 JWT Configuration
  ========================== */
  ACCESS_TOKEN_EXP:
    process.env.ACCESS_TOKEN_EXP || "15m",

  ACCESS_TOKEN_EXP_TIME:
    Number(process.env.ACCESS_TOKEN_EXP_TIME) || 900,

  REFRESH_TOKEN_EXP:
    process.env.REFRESH_TOKEN_EXP || "7d",

  REFRESH_TOKEN_EXP_TIME:
    Number(process.env.REFRESH_TOKEN_EXP_TIME) || 604800,

  JWT_SECRET: process.env.JWT_SECRET || "your_jwt_secret_key",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "your_jwt_secret_key",

  /* =========================
     🔏 Security
  ========================== */
  HMAC_SECRET:
    process.env.HMAC_SECRET || "default_secret_key",


  //    google console api key 


  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SCERET_key: process.env.GOOGLE_CLIENT_SECRET_KEY,


  //  kafka 


  KAFKA_CLIENT_ID: process.env.KAFKA_CLIENT_ID,
  KAFKA_BROKER: process.env.KAFKA_BROKER
};


