require("dotenv").config();

exports.config = {
    SERVICE_NAME: "Train-Service",

    /* =========================
      Server Configuration
    ========================== */
    PORT: Number(process.env.PORT) || 4003,
    NODE_ENV: process.env.NODE_ENV || "development",
    LOG_LEVEL: process.env.LOG_LEVEL || "info",
    CORS_ORIGIN: process.env.CORS_ORIGIN || "*",
    ALLOWED_ORIGINS:
        process.env.ALLOWED_ORIGINS || "http://localhost:4000",


    REDIS_URL:
        process.env.REDIS_URL || "redis://localhost:6379",

    REDIS_URL_TTL: Number(process.env.REDIS_URL_TTL) || 604800,


    DATABASE_URL:
        process.env.DATABASE_URL ||
        "postgresql://admin:irctcpass@localhost:5432/train_service",

};


