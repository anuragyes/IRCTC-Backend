// controllers/trainController.js
const trainSearchService = require("../Services/Searchtrain.service");

class TrainController {
  async getTrains(req, res) {
    try {
      const { source, destination, date } = req.query;

      if (!source || !destination || !date) {
        return res.status(400).json({
          success: false,
          message: "source, destination, and date are required",
        });
      }

      // Step 1: Find all RouteStops for source
      const sourceStops = await prisma.routeStop.findMany({
        where: {
          isStop: true,
          station: { code: source }
        },
        include: { train: true, station: true }
      });

      // Step 2: Find all RouteStops for destination
      const destinationStops = await prisma.routeStop.findMany({
        where: {
          isStop: true,
          station: { code: destination }
        },
        include: { train: true, station: true }
      });

      // Step 3: Match trains where source comes before destination
      const trains = [];
      for (const src of sourceStops) {
        const dest = destinationStops.find(
          d => d.trainId === src.trainId && d.stopNumber > src.stopNumber
        );
        if (dest) {
          trains.push({
            trainId: src.trainId,
            trainNumber: src.train.trainNumber,
            trainName: src.train.trainName,
            source: {
              stationCode: src.station.code,
              name: src.station.name,
              stopNumber: src.stopNumber,
              arrivalTime: src.arrivalTime,
              departureTime: src.departureTime,
              distanceFromSource: src.distanceFromSource
            },
            destination: {
              stationCode: dest.station.code,
              name: dest.station.name,
              stopNumber: dest.stopNumber,
              arrivalTime: dest.arrivalTime,
              departureTime: dest.departureTime,
              distanceFromSource: dest.distanceFromSource
            }
          });
        }
      }

      if (trains.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No trains found for this route",
        });
      }

      return res.status(200).json({
        success: true,
        data: trains
      });

    } catch (error) {
      console.error("Error in searchTrains:", error.message);
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

}


module.exports = new TrainController();