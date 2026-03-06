const { PrismaClient } = require("@prisma/client");


const prisma = new PrismaClient();

class SeatInventoryService {

  normalizeDate(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);    // normalize the tiem and date setHours(hours, minutes, seconds, milliseconds)
    return d;
  }

  async initializeInventory({ trainId, travelDate, classType, quota }) {
    return await prisma.$transaction(async (tx) => {    // tx is a transaction client provided by Prisma.  A transaction means: Either ALL database operations succeed ,  Or ALL fail (rollback)
      const journeyDate = this.normalizeDate(travelDate);

      const stops = await tx.routeStop.findMany({ where: { trainId }, orderBy: { stopNumber: "asc" } });
      if (stops.length < 2) throw new Error("Train must have at least 2 stops");

      const coaches = await tx.coach.findMany({ where: { trainId, type: classType } });
      if (!coaches.length) throw new Error("No coaches found for this class");

      const totalSeats = coaches.reduce((sum, c) => sum + c.totalSeats, 0);
      const racSeats = Math.floor(totalSeats * 0.2);

      const segments = stops.slice(0, stops.length - 1).map(stop => ({
        trainId,
        travelDate: journeyDate,
        classType,
        quota,
        segmentNo: stop.stopNumber,
        availableCount: totalSeats,
        racAvailable: racSeats,
        version: 0     // here version 
      }));

      await tx.seatInventory.createMany({ data: segments, skipDuplicates: true });
      return { message: "Inventory initialized", totalSeats, racSeats };
    });
  }

  async bookSeats({ trainId, travelDate, classType, quota, fromStopNo, toStopNo, passengerCount, userID }) {
    return await prisma.$transaction(async (tx) => {
      const journeyDate = this.normalizeDate(travelDate);   // this is use to get normaizationDtae above function scope 
      //  console.log("this is userid comes frim seatinvertyservice",userID)
      // Fetch all segments
      const segments = [];
      for (let seg = fromStopNo; seg < toStopNo; seg++) {
        const inv = await tx.seatInventory.findFirst({ where: { trainId, travelDate: journeyDate, classType, quota, segmentNo: seg } });
        if (!inv) throw new Error(`Inventory missing for segment ${seg}`);
        segments.push(inv);
      }

      // Determine booking status
      const minAvailable = Math.min(...segments.map(s => s.availableCount));
      const minRac = Math.min(...segments.map(s => s.racAvailable));
      let status, seatNumber = null, racNumber = null, wlNumber = null;

      if (minAvailable >= passengerCount) status = "CONFIRMED";
      else if (minRac >= passengerCount) status = "RAC";
      else status = "WAITING";

      // Deduct inventory atomically
      for (const seg of segments) {
        if (status === "CONFIRMED") {
          const updated = await tx.seatInventory.updateMany({
            where: { id: seg.id, version: seg.version, availableCount: { gte: passengerCount } },
            data: { availableCount: { decrement: passengerCount }, version: { increment: 1 } }
          });
          if (!updated.count) throw new Error("Seat conflict");
        }
        if (status === "RAC") {
          const updated = await tx.seatInventory.updateMany({
            where: { id: seg.id, version: seg.version, racAvailable: { gte: passengerCount } },
            data: { racAvailable: { decrement: passengerCount }, version: { increment: 1 } }
          });
          if (!updated.count) throw new Error("RAC conflict");
        }
      }

      // Assign seat numbers for CONFIRMED
      if (status === "CONFIRMED") {
        const coaches = await tx.coach.findMany({ where: { trainId, type: classType } });
        const allocatedSeats = [];
        let remaining = passengerCount;

        for (const coach of coaches) {
          const freeSeats = await tx.seat.findMany({ where: { coachId: coach.id, isBooked: false }, take: remaining });
          for (const s of freeSeats) {
            allocatedSeats.push(`${coach.coachName}-${s.seatNo}`);
            await tx.seat.update({ where: { id: s.id }, data: { isBooked: true } });
          }
          remaining -= freeSeats.length;
          if (remaining <= 0) break;
        }

        seatNumber = allocatedSeats.join(",");
      }

      // Assign RAC numbers
      if (status === "RAC") {
        const lastRac = await tx.booking.findFirst({ where: { trainId, travelDate: journeyDate, classType, quota, status: "RAC" }, orderBy: { racNumber: "desc" } });
        racNumber = lastRac ? lastRac.racNumber + 1 : 1;

        // Temporary RAC seat assignment
        seatNumber = `RAC-${racNumber}`;
      }

      // Assign WL numbers
      if (status === "WAITING") {
        const lastWL = await tx.booking.findFirst({ where: { trainId, travelDate: journeyDate, classType, quota, status: "WAITING" }, orderBy: { wlNumber: "desc" } });
        wlNumber = lastWL ? lastWL.wlNumber + 1 : 1;
        seatNumber = `WL-${wlNumber}`;
      }

      // Create booking
      const pnrNumber = "PNR" + Date.now() + Math.floor(Math.random() * 10000);
      const booking = await tx.booking.create({
        data: { pnrNumber, trainId, travelDate: journeyDate, classType, quota, fromStopNo, toStopNo, passengerCount, status, seatNumber, racNumber, wlNumber , userID  }
      });

      return { message: "Booking successful", booking };
    });
  }

  async cancelBooking(pnrNumber) {
    return await prisma.$transaction(async (tx) => {
      // find pnr number if pnr number 
      const booking = await tx.booking.findUnique({ where: { pnrNumber } });
      if (!booking) throw new Error("Booking not found");
      if (booking.status === "CANCELLED") throw new Error("Already cancelled");


      // step 2
      // get all the number if according to pnr
      const { trainId, travelDate, classType, quota, fromStopNo, toStopNo, passengerCount, status } = booking;
      const journeyDate = this.normalizeDate(travelDate);

      // Restore inventory
      for (let seg = fromStopNo; seg < toStopNo; seg++) {
        if (status === "CONFIRMED") await tx.seatInventory.updateMany({ where: { trainId, travelDate: journeyDate, classType, quota, segmentNo: seg }, data: { availableCount: { increment: passengerCount }, version: { increment: 1 } } });
        if (status === "RAC") await tx.seatInventory.updateMany({ where: { trainId, travelDate: journeyDate, classType, quota, segmentNo: seg }, data: { racAvailable: { increment: passengerCount }, version: { increment: 1 } } });
      }

      // Free seats if CONFIRMED
      if (status === "CONFIRMED") {
        const seats = booking.seatNumber.split(",");
        for (const s of seats) {
          const [coachName, seatNo] = s.split("-");
          const coach = await tx.coach.findFirst({ where: { trainId, coachName } });
          await tx.seat.updateMany({ where: { coachId: coach.id, seatNo: seatNo.toString() }, data: { isBooked: false } });
        }
      }

      await tx.booking.update({ where: { id: booking.id }, data: { status: "CANCELLED" } });

      // Promote RAC → CONFIRMED
      const racList = await tx.booking.findMany({ where: { trainId, travelDate: journeyDate, classType, quota, status: "RAC" }, orderBy: { racNumber: "asc" } });
      if (status === "CONFIRMED" && racList.length) {
        const promoteRac = racList[0];
        await tx.booking.update({ where: { id: promoteRac.id }, data: { status: "CONFIRMED", racNumber: null } });
        for (let i = 1; i < racList.length; i++) await tx.booking.update({ where: { id: racList[i].id }, data: { racNumber: racList[i].racNumber - 1 } });
      }

      // Promote WL → RAC
      const wlList = await tx.booking.findMany({ where: { trainId, travelDate: journeyDate, classType, quota, status: "WAITING" }, orderBy: { wlNumber: "asc" } });
      if (wlList.length) {
        const promoteWL = wlList[0];
        const racCount = await tx.booking.count({ where: { trainId, travelDate: journeyDate, classType, quota, status: "RAC" } });
        await tx.booking.update({ where: { id: promoteWL.id }, data: { status: "RAC", wlNumber: null, racNumber: racCount + 1, seatNumber: `RAC-${racCount + 1}` } });
        for (let i = 1; i < wlList.length; i++) await tx.booking.update({ where: { id: wlList[i].id }, data: { wlNumber: wlList[i].wlNumber - 1, seatNumber: `WL-${wlList[i].wlNumber - 1}` } });
      }

      return { message: "Booking cancelled successfully" };
    });
  }


    // get ticket booked 
   async GetTicket(userID) {

    if (!userID) {
        throw new Error("userID is missing");
    }

    const tickets = await prisma.booking.findMany({
        where: { userID },   // based on userid
    });

    return tickets;
}

}




module.exports = new SeatInventoryService();
