const express = require("express");
const inventoryrouter = express.Router();
const inventoryController = require("../Controllers/inventory.controller");

inventoryrouter.post("/initialize", inventoryController.initialize);

// POST: generate seat allocation for a train/date/class
inventoryrouter.post("/generate", inventoryController.generate);

// GET: list all allocations for a train/date/class
inventoryrouter.get("/list", inventoryController.list);

module.exports = inventoryrouter;