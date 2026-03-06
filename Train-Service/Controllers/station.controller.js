const stationService = require("../Services/station.service");

class StationController {

  async create(req, res) {
    try {
      const station = await stationService.createStation(req.body);
      return res.status(201).json({
        success: true,
        data: station
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getAll(req, res) {
    try {
      const stations = await stationService.getAllStations();
      return res.status(200).json({
        success: true,
        data: stations
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getByCode(req, res) {
    try {
      const { code } = req.params;
      const station = await stationService.getStationByCode(code);

      return res.status(200).json({
        success: true,
        data: station
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  async delete(req, res) {
    try {
      const { code } = req.params;
      await stationService.deleteStation(code);

      return res.status(200).json({
        success: true,
        message: "Station deleted successfully"
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new StationController();