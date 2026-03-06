const routeService = require("../Services/routes.services");

class RouteController {

    async create(req, res) {
        try {
            const { trainId, totalDistance } = req.body;

            console.log("this is taied id" , trainId)

            const route = await routeService.createRoute(trainId, totalDistance);

            return res.status(201).json({
                success: true,
                data: route
            });

        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

  async addStops(req, res) {
  try {
    const trains = req.body;  // entire array

    if (!Array.isArray(trains)) {
      throw new Error("Body must be an array");
    }

    for (const trainData of trains) {
      await routeService.addRouteStops(
        trainData.trainId,
        trainData.stops
      );
    }

    return res.status(201).json({
      success: true,
      message: "All route stops added successfully"
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

async getStationsByTrainId(req, res) {
  try {
    const { id: trainId } = req.params;
    console.log("Fetching stations for trainId:", trainId);

    // Fetch train with routeStops relation
    const train = await prisma.train.findUnique({
      where: { id: trainId },  // primary key
      include: {
        routeStops: {          // ✅ use exact relation name in Train model (lowercase)
          orderBy: { stopNumber: 'asc' },
          include: { station: true }  // include full station details
        }
      }
    });

    if (!train) {
      return res.status(404).json({
        success: false,
        message: "Train not found",
      });
    }

    // If no routeStops yet, return empty array
    if (!train.routeStops || train.routeStops.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "No stops defined for this train yet"
      });
    }

    // Map stops to API-friendly format
    const stations = train.routeStops.map(stop => ({
      stationCode: stop.station.code,
      name: stop.station.name,
      city: stop.station.city,
      state: stop.station.state,
      stopNumber: stop.stopNumber,
      arrivalTime: stop.arrivalTime,
      departureTime: stop.departureTime,
      distanceFromSource: stop.distanceFromSource,
      isStop: stop.isStop,          // ✅ include if train stops here
      createdAt: stop.station.createdAt
    }));

    console.log("Stations fetched:", stations);

    return res.status(200).json({
      success: true,
      data: stations
    });

  } catch (error) {
    console.error("Error in getStationsByTrainId:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}




}

module.exports = new RouteController();