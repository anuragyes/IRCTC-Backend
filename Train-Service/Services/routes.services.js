const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class RouteService {

  // Create Route for a Train
  async createRoute(trainId, totalDistance) {


      console.log("this is our train id" , trainId)
    // Check if train exists
    const train = await prisma.train.findUnique({
      where: { id: trainId }
    });


     console.log("this is router from tarin id" , train);

    //   console.log("this is service tarin id" , train)
    if (!train) {
      throw new Error("Train not found");
    }

  
    const route = await prisma.route.create({
      data: {
        trainId,
        totalDistance
      }
    });

    return route;
  }

  // Add Route Stops (Bulk)
 async addRouteStops(trainId, stops) {

  if (!trainId) {
    throw new Error("trainId is required");
  }

  const train = await prisma.train.findUnique({
    where: { id: trainId }
  });

  if (!train) {
    throw new Error("Train not found");
  }

  for (const stop of stops) {

    if (!stop.stationId || stop.stopNumber == null) {
      throw new Error("stationId and stopNumber are required");
    }

    const station = await prisma.station.findUnique({
      where: { id: stop.stationId }
    });

    if (!station) {
      throw new Error(`Station not found`);
    }

    await prisma.routeStop.upsert({
      where: {
        trainId_stopNumber: {
          trainId: trainId,
          stopNumber: stop.stopNumber
        }
      },
      create: {
        trainId: trainId,
        stationId: stop.stationId,
        stopNumber: stop.stopNumber,
        arrivalTime: stop.arrivalTime
          ? new Date(stop.arrivalTime)
          : null,
        departureTime: stop.departureTime
          ? new Date(stop.departureTime)
          : null,
        distanceFromSource: stop.distanceFromSource ?? null,
        isStop: stop.isStop ?? true,  // ✅ use provided value or default true
      },
      update: {
        stationId: stop.stationId,
        arrivalTime: stop.arrivalTime
          ? new Date(stop.arrivalTime)
          : null,
        departureTime: stop.departureTime
          ? new Date(stop.departureTime)
          : null,
        distanceFromSource: stop.distanceFromSource ?? null,
         isStop: stop.isStop ?? true,
      }
    });
  }

  return { message: "Route stops added successfully" };
}

}

module.exports = new RouteService();