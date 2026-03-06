// const { PrismaClient } = require("@prisma/client");
// const prisma = new PrismaClient();

// class CoachService {
//   // Create coach and automatically seats
//   async createCoach(trainId, coachName, totalSeats) {
//     // 1️⃣ Create the coach
//     const coach = await prisma.coach.create({
//       data: {
//         trainId,
//         coachName,
//         totalSeats,
//       },
//     });

//     // 2️⃣ Create seats for this coach
//     const seatData = [];
//     for (let i = 1; i <= totalSeats; i++) {
//       seatData.push({
//         coachId: coach.id,
//         seatNumber: `S${i}`, // S1, S2, ...
//       });
//     }

//     await prisma.seat.createMany({
//       data: seatData,
//     });

//     return coach;
//   }

//   // Get seats of a coach
//   async getSeatsByCoach(coachId) {
//     return await prisma.seat.findMany({
//       where: { coachId },
//       orderBy: { seatNumber: "asc" },
//     });
//   }

//   // Get all coaches of a train
//   async getCoachesByTrain(trainId) {
//     return await prisma.coach.findMany({
//       where: { trainId },
//       include: { seats: true },
//       orderBy: { coachName: "asc" },
//     });
//   }
// }

// module.exports = new CoachService();




const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class TrainCoachService {

  // Add coaches and generate seats for a train
  async addCoaches(trainId, coachData) {
    if (!trainId || !coachData || !coachData.length) {
      throw new Error("trainId and coachData are required");
    }

    const train = await prisma.train.findUnique({ where: { id: trainId } });
    if (!train) throw new Error("Train not found");

    const createdCoaches = [];

    for (const c of coachData) {
      const totalSeats = this.getTotalSeatsForType(c.type);

      // Create coach
      const coach = await prisma.coach.create({
        data: {
          trainId,
          coachName: c.coachName,
          type: c.type,
          totalSeats,
        },
      });

      // Generate seats
      const seats = this.generateSeats(coach.id, totalSeats, c.type);

      await prisma.seat.createMany({ data: seats });

      createdCoaches.push({ coach, seats });
    }

    return createdCoaches;
  }

  generateSeats(coachId, totalSeats, type) {
    const seats = [];
    for (let i = 1; i <= totalSeats; i++) {
      let berthType;

      if (type === "SL") {
        const pattern = ["L","M","U","L","M","U","SL","SU"];
        berthType = pattern[(i-1) % 8];
      } else if (type === "3AC") {
        const pattern = ["L","M","U","L","M","U","SU","SU"];
        berthType = pattern[(i-1) % 8];
      } else if (type === "2AC") {
        const pattern = ["L","U","L","U"];
        berthType = pattern[(i-1) % 4];
      } else if (type === "1AC") {
        berthType = "L";
      }

      seats.push({ coachId, seatNo: i.toString(), berthType });
    }
    return seats;
  }

  getTotalSeatsForType(type) {
    if (type === "SL") return 72;
    if (type === "3AC") return 64;
    if (type === "2AC") return 48;
    if (type === "1AC") return 24;
    return 0;
  }

}

module.exports = new TrainCoachService();