const { prisma } = require("../Config/prisma");
const { v4: uuidv4 } = require("uuid");

class BookingService {

  async bookSeats({ trainId, travelDate, classType, quota, fromStopNo, toStopNo, seatsToBook, berthPreference }) {
    return await prisma.$transaction(async (tx) => {

      const availableSeats = await tx.seatAllocation.findMany({
        where: {
          trainId,
          travelDate: new Date(travelDate),
          classType,
          isBooked: false,
        },
        orderBy: { seatNumber: "asc" },
        take: seatsToBook,
      });

        console.log("this is total length " , availableSeats.length);

      if (availableSeats.length < seatsToBook) {
        throw new Error("Not enough seats available");
      }

      const bookedSeats = [];

      for (const seat of availableSeats) {
        await tx.seatAllocation.update({
          where: { id: seat.id },
          data: { isBooked: true },
        });
        bookedSeats.push(seat.seatNumber);
      }

      const pnrNumber = "PNR" + Math.floor(Math.random() * 1000000000);

      const booking = await tx.booking.create({
        data: {
          id: uuidv4(),
          pnrNumber,
          trainId,
          travelDate: new Date(travelDate),
          classType,
          quota,
          fromStopNo,
          toStopNo,
          status: "CONFIRMED",
          seatNumber: bookedSeats.join(", "),
        },
      });

      return {
        message: "Seats booked successfully",
        bookingId: booking.id,
        pnrNumber: booking.pnrNumber,
        bookedSeats: bookedSeats.length,
        seats: bookedSeats,
      };
    });
  }
}

module.exports = new BookingService();