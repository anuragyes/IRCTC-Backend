// using singleton pattern for redis client
const Redis = require("ioredis");
const { config } = require(".");
const logger = require("./logger");

class RedisClient {
  static instance = null;
  static isConnected = false;

  constructor() {
    if (RedisClient.instance) {
      return RedisClient.instance;
    }

    RedisClient.instance = new Redis(config.REDIS_URL, {
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: 3,
    });

    this.setupEventListeners();
  }

  setupEventListeners() {
    RedisClient.instance.on("connect", () => {
      RedisClient.isConnected = true;
      logger.info("Connected to Redis");
    });

    RedisClient.instance.on("error", (err) => {
      RedisClient.isConnected = false;
      logger.error("Redis connection error: " + err);
    });
  }

  static getInstance() {
    if (!RedisClient.instance) {
      new RedisClient();
    }
    return RedisClient.instance;
  }
}

module.exports = RedisClient;


