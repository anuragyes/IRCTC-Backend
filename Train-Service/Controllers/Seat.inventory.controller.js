const { BadRequestError } = require("../../User-Service/utils/errorTypes");
const seatInvertoryService = require("../Services/seat.invertory.service");
const seatInventoryService = require("../Services/seat.invertory.service");

class SeatInventoryController {
  /**
   * Initialize inventory for a train and date
   */
  async initialize(req, res) {
    try {
      const { trainId, travelDate, classType, quota, totalSegments, totalSeats, racSeats } = req.body;

      const result = await seatInventoryService.initializeInventory({
        trainId,
        travelDate: new Date(travelDate),
        classType,
        quota,
        totalSegments,
        totalSeats,
        racSeats
      });

      return res.status(201).json({
        success: true,
        message: "Seat inventory initialized",
        data: result
      });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  /**
   * Get available seats for a segment
   */
  async getAvailable(req, res) {
    try {
      const { trainId, travelDate, classType, quota, segmentNo } = req.query;

      const available = await seatInventoryService.getAvailableSeats({
        trainId,
        travelDate: new Date(travelDate),
        classType,
        quota,
        segmentNo: parseInt(segmentNo)
      });

      return res.status(200).json({
        success: true,
        availableSeats: available
      });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  /**
   * Book seats for a segment
   */
  async book(req, res) {
    try {
      const { trainId, travelDate, classType, quota, fromStopNo, toStopNo, passengerCount } = req.body;


      // console.log("this is req.body " , req.body);


      const result = await seatInventoryService.bookSeats({
        trainId,
        travelDate: new Date(travelDate),
        classType,
        quota,
        fromStopNo,
        toStopNo,
        passengerCount,
        userID: req.user.id

      });

      const userID = req.user.id;
      console.log("thsi si suserid", userID);

      return res.status(200).json({
        success: true,
        message: "Seats booked successfully",
        data: result
      });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ success: false, message: error.message });
    }
  }





  async simulateBookings() {
    const trainId = "6bfa533b-22be-43fe-9fba-13da340e6114";
    const travelDate = "2026-03-05";
    const classType = "SL";
    const quota = "GENERAL";

    console.log("=== Initializing Inventory ===");
    await seatInvertoryService.initializeInventory({ trainId, travelDate, classType, quota });
    console.log("Inventory initialized ✅\n");

    const bookings = [
      { fromStopNo: 1, toStopNo: 3, passengerCount: 3 }, // CONFIRMED
      { fromStopNo: 1, toStopNo: 3, passengerCount: 4 }, // CONFIRMED if seats available
      { fromStopNo: 1, toStopNo: 3, passengerCount: 2 }, // RAC
      { fromStopNo: 1, toStopNo: 3, passengerCount: 2 }  // WAITING
    ];

    for (const request of bookings) {
      const result = await seatInventoryService.bookSeats({
        trainId,
        travelDate,
        classType,
        quota,
        ...request
      });

      console.log("Booking Result:", result.booking.status, "| Seats:", result.booking.seatNumber);
    }

    console.log("\n=== Simulating Cancellation of First CONFIRMED Booking ===");
    const firstBookingPNR = await seatInventoryService.bookSeats({
      trainId,
      travelDate,
      classType,
      quota,
      fromStopNo: 1,
      toStopNo: 3,
      passengerCount: 3
    });

    console.log("Cancelling PNR:", firstBookingPNR.booking.pnrNumber);
    await seatInventoryService.cancelBooking(firstBookingPNR.booking.pnrNumber);
    console.log("Cancellation Done ✅");

    console.log("\nCheck RAC and WAITING promotion after cancellation in DB.");
  }







  async cancelBooking(req, res) {

    try {

      const { pnrNumber } = req.body;
      console.log("this is pnr number", pnrNumber)

      if (!pnrNumber) {
        return res.status(400).json({
          success: false,
          message: "PNR number is required"
        });
      }

      const result = await seatInventoryService.cancelBooking(pnrNumber);

      return res.status(200).json({
        success: true,
        message: result.message
      });

    } catch (error) {

      return res.status(400).json({
        success: false,
        message: error.message
      });

    }
  }




  async getTicket(req, res) {
    try {
      const { userID } = req.body;

      if (!userID) {
        throw new BadRequestError("userID is missing");
      }

      const tickets = await seatInventoryService.GetTicket(userID);

      return res.status(200).json({
        success: true,
        data: tickets
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }


}



module.exports = new SeatInventoryController();