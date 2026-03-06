const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class SeatInventoryService {

  /* =========================================
     1️⃣ Initialize Inventory
  ========================================= */
  async initializeInventory({
    trainId,
    travelDate,
    classType,
    quota = "GENERAL",
    totalSegments,
    totalSeats,
    racSeats = 0
  }) {

    const records = [];

    for (let segmentNo = 1; segmentNo <= totalSegments; segmentNo++) {
      records.push({
        trainId,
        travelDate: new Date(travelDate),
        classType,
        quota,
        segmentNo,
        availableCount: totalSeats,
        racAvailable: racSeats,
        version: 0
      });
    }

    return await prisma.seatInventory.createMany({
      data: records,
      skipDuplicates: true
    });
  }

  /* =========================================
     2️⃣ Book Seats (CONFIRMED / RAC / WL)
  ========================================= */
  async bookSeats({
    trainId,
    travelDate,
    classType,
    quota = "GENERAL",
    segmentNo,
    seatsToBook
  }) {

    return await prisma.$transaction(async (tx) => {

      // 🔹 Fetch inventory row
      const inventory = await tx.seatInventory.findFirst({
        where: {
          trainId,
          travelDate: new Date(travelDate),
          classType,
          quota,
          segmentNo
        }
      });

      if (!inventory) {
        throw new Error("Inventory not initialized for this segment");
      }

      let confirmed = [];
      let rac = [];
      let waiting = [];

      let available = inventory.availableCount;
      let racAvailable = inventory.racAvailable;

      for (let i = 0; i < seatsToBook; i++) {

        if (available > 0) {
          confirmed.push(`S${available}`);
          available--;
        }
        else if (racAvailable > 0) {
          rac.push(`RAC-${racAvailable}`);
          racAvailable--;
        }
        else {
          waiting.push(`WL-${i + 1}`);
        }
      }

      // 🔹 Update inventory safely
      await tx.seatInventory.update({
        where: { id: inventory.id },
        data: {
          availableCount: available,
          racAvailable: racAvailable,
          version: inventory.version + 1
        }
      });

      return {
        confirmedSeats: confirmed,
        racSeats: rac,
        waitingSeats: waiting,
        remainingConfirmed: available,
        remainingRAC: racAvailable
      };

    });
  }

  /* =========================================
     3️⃣ Get Availability
  ========================================= */
  async getAvailability({
    trainId,
    travelDate,
    classType,
    quota = "GENERAL",
    segmentNo
  }) {

    const inventory = await prisma.seatInventory.findFirst({
      where: {
        trainId,
        travelDate: new Date(travelDate),
        classType,
        quota,
        segmentNo
      }
    });

    if (!inventory) return null;

    return {
      availableConfirmed: inventory.availableCount,
      availableRAC: inventory.racAvailable
    };
  }

}

module.exports = new SeatInventoryService();