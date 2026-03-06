const { prisma } = require("../Config/prisma");
const RedisClient = require("../Config/redis");
const redis = RedisClient.getInstance();

class TrainSearchService {
  async searchTrains(sourceCode, destCode, travelDate) {
    const redisKey = `train:${sourceCode}:${destCode}:${travelDate}`;

    // 1️ Redis cache
    const cached = await redis.get(redisKey);
    if (cached) return JSON.parse(cached);

    // 2️ Query Trains with routeStops & stations
    const trains = await prisma.train.findMany({
      include: {
        routeStops: {
          include: { station: true },
          orderBy: { stopNumber: "asc" },
        },
      },
    });

    // 3️ Filter trains that have source → destination in correct order
    const result = trains
      .map((train) => {
        const stops = train.routeStops;
        const sourceIndex = stops.findIndex(
          (s) => s.station.code === sourceCode
        );
        const destIndex = stops.findIndex(
          (s) => s.station.code === destCode
        );

        if (sourceIndex >= 0 && destIndex > sourceIndex) {
          return {
            trainId: train.id,
            trainNumber: train.trainNumber,
            trainName: train.trainName,
            from: stops[sourceIndex].station.name,
            to: stops[destIndex].station.name,
            departureTime: stops[sourceIndex].departureTime,
            arrivalTime: stops[destIndex].arrivalTime,
            distance:
              stops[destIndex].distanceFromSource -
              stops[sourceIndex].distanceFromSource,
          };
        }
        return null;
      })
      .filter(Boolean);

    // 4️⃣ Cache result for 10 mins
    await redis.set(redisKey, JSON.stringify(result), "EX", 600);

    return result;
  }
}

module.exports = new TrainSearchService();