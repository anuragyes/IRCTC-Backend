const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();


class StationService {

  // Create Station
  async createStation(data) {
    const { code, name, city, state } = data;

    // Check if station already exists
    const existing = await prisma.station.findUnique({
      where: { code }
    });

    if (existing) {
      throw new Error("Station with this code already exists");
    }

    const station = await prisma.station.create({
      data: {
        code,
        name,
        city,
        state
      }
    });

    return station;
  }

  // Get All Stations
  async getAllStations() {
    return await prisma.station.findMany({
      orderBy: {
        createdAt: "desc"
      }
    });
  }

  // Get Single Station by Code
  async getStationByCode(code) {
    const station = await prisma.station.findUnique({
      where: { code }
    });

    if (!station) {
      throw new Error("Station not found");
    }

    return station;
  }

  // Delete Station
  async deleteStation(code) {
    return await prisma.station.delete({
      where: { code }
    });
  }
}

module.exports = new StationService();