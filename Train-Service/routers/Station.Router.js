const express = require("express");
const stationController = require("../Controllers/station.controller");

const Stationrouter = express.Router();

Stationrouter.post("/stations", stationController.create);
Stationrouter.get("/Getstations", stationController.getAll);
Stationrouter.get("/stations/:code", stationController.getByCode);
Stationrouter.delete("/stations/:code", stationController.delete);

module.exports = Stationrouter;