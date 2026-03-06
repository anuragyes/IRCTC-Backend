// routes/trainRoutes.js
const express = require("express");
const { initialize, getAvailable, book, cancelBooking, simulateBookings, getTicket } = require("../Controllers/Seat.inventory.controller");
// const { requireAuth } = require("../../User-Service/utils/auth");

const SeatInventoryRouter = express.Router();


SeatInventoryRouter.post("/seat-inventory/initialize", initialize  );
SeatInventoryRouter.get("/available" ,getAvailable);
SeatInventoryRouter.post("/book" ,  book)

SeatInventoryRouter.post("/cancelConfirmTicket" , cancelBooking);
SeatInventoryRouter.get("/getTicket" , getTicket)


SeatInventoryRouter.post("/done" , simulateBookings);


module.exports = SeatInventoryRouter;
