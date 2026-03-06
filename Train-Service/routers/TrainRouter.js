const express = require("express");
const router = express.Router();

const trainController = require("../Controllers/train.controller");

router.post("/create", trainController.createTrain);

module.exports = router;