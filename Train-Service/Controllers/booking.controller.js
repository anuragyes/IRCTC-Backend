// // src/Controllers/Booking.controller.js
// const bookingService = require("../Services/bokking.Service");

// class BookingController {

//   // this function seat like movie booking sysytem 
//   // async reserveSeat(req, res) {
//   //   try {
//   //     const { trainId, coachId, seatNo, travelDate } = req.body;
//   //     const result = await bookingService.reserveSeat(trainId, coachId, seatNo, travelDate);
//   //     res.json({ success: true, data: result });
//   //   } catch (error) {
//   //     res.status(400).json({ success: false, message: error.message });
//   //   }
//   // }

//   // async confirmBooking(req, res) {
//   //   try {
//   //     const { reservationToken, trainId, coachId, seatNo, travelDate, fromStopNo, toStopNo } = req.body;
//   //     const result = await bookingService.confirmBooking(reservationToken, trainId, coachId, seatNo, travelDate, fromStopNo, toStopNo);
//   //     res.json({ success: true, data: result });
//   //   } catch (error) {
//   //     res.status(400).json({ success: false, message: error.message });
//   //   }
//   // }


//   async bookSeat(req, res) {
//   try {

//     const result = await bookingService.createBooking(req.body);

//     res.status(200).json({
//       success: true,
//       data: result
//     });

//   } catch (err) {
//     res.status(400).json({
//       success: false,
//       message: err.message
//     });
//   }
// }



//   async getTrainAvailability(req, res) {
//     try {
//       const { trainId } = req.params;
//       const { fromStopNo, toStopNo, travelDate } = req.query;

//       const fromNo = parseInt(fromStopNo);  // convert into interger
//       const toNo = parseInt(toStopNo);

//       const availability = await bookingService.getAvailableSeats(
//         trainId, fromNo, toNo, travelDate
//       );

//       res.json({ success: true, data: availability });
//     } catch (error) {
//       res.status(500).json({ success: false, message: error.message });
//     }
//   }
// }

// module.exports = new BookingController();



const { prisma } = require("../Config/prisma");




const { bookSeats } = require("../Services/bokking.Service")

class BookingController {
  async bookSeats(req, res) {
    try {
      const data = req.body;
      const result = await bookSeats(data);
      return res.status(200).json({ success: true, message: result.message, data: result });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = new BookingController();









