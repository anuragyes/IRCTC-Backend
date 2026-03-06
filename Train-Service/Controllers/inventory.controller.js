const inventoryService = require("../Services/Invertory.service");

class InventoryController {
  async initialize(req, res) {
    try {
      const { trainId, travelDate, classType, quota } = req.body;

       console.log("this is reqbody ", req.body)

      const result = await inventoryService.initializeInventory(
        trainId,
        travelDate,
        classType,
        quota
      );

      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }



  async generate(req, res) {
    try {
      const { trainId, travelDate, classType } = req.body;

      const result = await inventoryService.generateSeatAllocation(
        trainId,
        travelDate,
        classType
      );

      res.status(200).json({ success: true, data: result });
    } catch (err) {
      console.error(err);
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // List all allocations
  async list(req, res) {
    try {
      const { trainId, travelDate, classType } = req.query;

      const allocations = await inventoryService.getSeatAllocations(
        trainId,
        travelDate,
        classType
      );

      res.status(200).json({ success: true, data: allocations });
    } catch (err) {
      console.error(err);
      res.status(400).json({ success: false, message: err.message });
    }
  }
   

 



  
}

module.exports = new InventoryController();