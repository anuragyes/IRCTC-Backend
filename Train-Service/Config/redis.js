const Redis = require("ioredis");
  const {config} = require(".")

class RedisClient {
  static instance = null;

  constructor() {
    if (RedisClient.instance) return RedisClient.instance;

    // Connect to Redis with URL that includes password
    RedisClient.instance = new Redis(config.REDIS_URL, {
      retryStrategy: (times) => Math.min(times * 50, 2000),
      maxRetriesPerRequest: 3,
    });

    RedisClient.instance.on("connect", () => {
      console.log("✅ Connected to Redis");
    });

    RedisClient.instance.on("error", (err) => {
      console.error("❌ Redis connection error:", err);
    });

    return RedisClient.instance;
  }

  static getInstance() {
    if (!RedisClient.instance) new RedisClient();
    return RedisClient.instance;
  }
}

module.exports = RedisClient;