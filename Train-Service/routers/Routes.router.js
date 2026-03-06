const express = require("express");
const routeController = require("../Controllers/route.controller");


const Routesrouter = express.Router();

Routesrouter.post("/routes", routeController.create);
Routesrouter.post("/routes/stops", routeController.addStops);
Routesrouter.get("/GetRouteByTrain/:id", routeController.getStationsByTrainId);

module.exports = Routesrouter;