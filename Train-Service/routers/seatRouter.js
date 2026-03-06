// routes/seatRoutes.js
const express = require("express");
const Seatrouter = express.Router();

const { IsAvailableSeats } = require("../Controllers/Seat.controller");
// const { getTrainAvailability, reserveSeat, confirmBooking, bookSeat } = require("../Controllers/booking.controller");



const { bookSeats } = require("../Controllers/booking.controller");



// Capture trainId and travelDate as URL params
Seatrouter.get("/trainseat/:trainId/:travelDate", IsAvailableSeats);
Seatrouter.post("/booking/book" ,  bookSeats)


module.exports = Seatrouter;