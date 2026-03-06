// const express = require("express");
// const Coachrouter = express.Router();
// const coachController = require("../Controllers/couch.controller");

// // Create coach and seats
// Coachrouter.post("/coach", coachController.createCoach);

// // Get all seats of a coach
// Coachrouter.get("/coach/:coachId/seats", coachController.getSeats);

// // Get all coaches of a train
// Coachrouter.get("/train/:trainId/coaches", coachController.getCoachesByTrain);

// module.exports = Coachrouter;


const express = require("express");
const Coachrouter = express.Router();
const { addCoaches } = require("../Controllers/couch.controller");

Coachrouter.post("/:trainId/add-coaches", addCoaches);

module.exports = Coachrouter;