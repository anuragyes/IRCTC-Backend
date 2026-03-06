// routes/trainRoutes.js
const express = require("express");
const SearchTrainRouter = express.Router();
const trainController = require("../Controllers/SearchTrain.controller");

SearchTrainRouter.get("/search", trainController.getTrains);




module.exports = SearchTrainRouter;