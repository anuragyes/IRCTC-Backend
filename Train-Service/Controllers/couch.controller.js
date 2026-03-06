


  // GET /coach/:coachId/seats
//   async getSeats(req, res) {
//     try {
//       const { coachId } = req.params;

//       const seats = await coachService.getSeatsByCoach(coachId);

//       return res.status(200).json({
//         success: true,
//         data: seats,
//       });
//     } catch (error) {
//       console.error("Error in getSeats:", error.message);
//       return res.status(500).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   }

//   // GET /train/:trainId/coaches
//   async getCoachesByTrain(req, res) {
//     try {
//       const { trainId } = req.params;

//       const coaches = await coachService.getCoachesByTrain(trainId);

//       return res.status(200).json({
//         success: true,
//         data: coaches,
//       });
//     } catch (error) {
//       console.error("Error in getCoachesByTrain:", error.message);
//       return res.status(500).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   }
// }

// module.exports = new CoachController();

const trainCoachService = require("../Services/coach.service");

async function addCoaches(req, res) {
  try {
    const { trainId } = req.params;
    const coachData = req.body.coaches; // [{coachName, type}, ...]

    const result = await trainCoachService.addCoaches(trainId, coachData);

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = { addCoaches };