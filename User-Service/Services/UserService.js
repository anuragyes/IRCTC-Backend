const logger = require("../Config/Logger");
const RedisClient = require("../Config/redis"); // import class
const prisma = require("../Config/prisma");

const redisClient = RedisClient.getInstance(); // ✅ get actual instance

exports.getProfile = async (userID) => {
  console.log("🔎 getProfile called with userID:", userID);

  if (!userID) {
    throw new Error("User ID is required");
  }

  const cacheKey = `user:${userID}`;

  try {
    logger.info("Checking Redis for user profile...");

    const cachedUser = await redisClient.get(cacheKey); // 

    if (cachedUser) {
      logger.info("✅ User fetched from Redis");
      return JSON.parse(cachedUser);
    }

    logger.info("User not found in Redis. Checking database...");

    const user = await prisma.user.findUnique({
      where: { id: userID },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // ioredis does NOT use setEx
    await redisClient.set(cacheKey, JSON.stringify(user), "EX", 60 * 60);

    logger.info(" User stored in Redis cache");

    return user;

  } catch (error) {
    logger.error(" Error in getProfile:", error);
    throw error;
  }
};
