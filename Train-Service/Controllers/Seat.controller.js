const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const seatService = require("../Services/Seat.Service")

async function getTrainSeats(req, res) {
  try {
    const { trainId } = req.params;

    const coaches = await prisma.coach.findMany({
      where: { trainId },
      include: {
        seats: true
      }
    });

    res.json(coaches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


function generateSeats(coachId, totalSeats, type) {
  const seats = [];
  for (let i = 1; i <= totalSeats; i++) {
    let berthType;
    if (type === "SL") {
      // 8-seat pattern: Lower, Middle, Upper, Lower, Middle, Upper, Side Lower, Side Upper
      const pattern = ["L", "M", "U", "L", "M", "U", "SL", "SU"];
      berthType = pattern[(i - 1) % 8];
    } else if (type === "3AC") {
      const pattern = ["L", "M", "U", "L", "M", "U", "SU", "SU"];
      berthType = pattern[(i - 1) % 8];
    } else if (type === "2AC") {
      const pattern = ["L", "U", "L", "U"];
      berthType = pattern[(i - 1) % 4];
    } else if (type === "1AC") {
      berthType = "L";
    }

    seats.push({ coachId, seatNo: i.toString(), berthType });
  }
  return seats;
}





async function IsAvailableSeats(req, res) {
  try {
    const { trainId, travelDate } = req.params;
    const { fromStationNo, toStationNo } = req.query; // query params

    console.log("Params:", req.params, "Query:", req.query);

    // Convert query params to numbers
    const fromNo = fromStationNo ? parseInt(fromStationNo) : null;
    const toNo = toStationNo ? parseInt(toStationNo) : null;

    const seats = await seatService.getAvailableSeats(trainId, travelDate, fromNo, toNo);

    res.json({ success: true, data: seats });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
}




module.exports = { getTrainSeats, IsAvailableSeats, generateSeats };