const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class SeatService {
  
  // async getAvailableSeats(trainId, travelDate, fromStationNo, toStationNo) {
  //   if (!trainId || !travelDate || fromStationNo == null || toStationNo == null) {
  //     throw new Error("Missing required parameters");
  //   }

  //   // 1️⃣ Get all seats of the train
  //   const allSeats = await prisma.seat.findMany({
  //     where: { trainId },
  //     include: { coach: true } // optional: include coach info
  //   });

  //   // 2️⃣ Get all bookings for this train on this date
  //   const bookedSeats = await prisma.booking.findMany({
  //     where: {
  //       trainId,
  //       travelDate,
  //       status: "CONFIRMED",
  //       // This assumes your booking table stores fromStationNo/toStationNo
  //       OR: [
  //         {
  //           fromStationNo: { lte: toStationNo },
  //           toStationNo: { gte: fromStationNo },
  //         }
  //       ]
  //     },
  //     select: { seatId: true },
  //   });

  //   const bookedSeatIds = bookedSeats.map(b => b.seatId);

  //   // 3️⃣ Filter available seats
  //   const availableSeats = allSeats.filter(s => !bookedSeatIds.includes(s.id));

  //   return availableSeats;
  // }


  async getAvailableSeats(trainId, fromStopNo, toStopNo, travelDate) {
  // 1️⃣ Get all seats for train coaches
  const allSeats = await prisma.seat.findMany({
    include: { coach: true },
    where: {
      coach: { trainId },
    },
  });

  // 2️⃣ Get booked seats for this train & date for overlapping segment
  const booked = await prisma.booking.findMany({
    where: {
      trainId,
      travelDate,
      OR: [
        {
          fromStopNo: { lte: toStopNo },
          toStopNo: { gte: fromStopNo },
        },
      ],
      status: "CONFIRMED",
    },
    select: { seatId: true },
  });

  const bookedSeatIds = booked.map((b) => b.seatId);

  // 3️⃣ Filter available seats
  const available = allSeats.filter((s) => !bookedSeatIds.includes(s.id));

  return available;
}
}


module.exports = new SeatService();