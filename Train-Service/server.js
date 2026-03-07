
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const Logger = require("./Config/Logger");
const { config } = require('./Config/index');

const corsMiddleware = require(
    "./Middleware/corsMiddleware"
);

const reqLogger = require("./Middleware/req.middleware");

const errorHandler = require('./Middleware/error.middleware');
const Trainrouter = require('./routers/TrainRouter');
const Stationrouter = require('./routers/Station.Router');
const Routesrouter = require('./routers/Routes.router');
const Coachrouter = require('./routers/coach.router');
const SearchTrainRouter = require('./routers/searchTrain.router');
const Seatrouter = require('./routers/seatRouter');
const inventoryrouter = require('./routers/Invertory.router');
const SeatInventoryRouter = require('./routers/Seat.inventory.router');

const app = express();
const PORT = 4003;

console.log("DATABASE_URL from ENV:", config.DATABASE_URL);

// -------------------- MIDDLEWARE --------------------
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(helmet());
app.use(reqLogger);
app.use(cors());
app.use(corsMiddleware);
app.use(express.urlencoded({ extended: true }));





// -------------------- ROUTES --------------------
app.get('/', (req, res) => {
    res.send('Train Service is live now ');
});


app.get("/train/health", (req, res) => {
    res.status(200).json({
        status: "UP",
        message: "User Service is healthy"
    });
});

app.use("/api/auth/train", Trainrouter);
app.use("/api/auth/station", Stationrouter);
app.use("/api/auth/routes", Routesrouter)
app.use("/api/auth/coach/seat", Coachrouter);
app.use("/api/auth/train", SearchTrainRouter);
app.use("/api/auth/seat/available", Seatrouter);
app.use("/api/auth/booking/inventory", inventoryrouter)
app.use("/api/auth/seat", SeatInventoryRouter)

// -------------------- ERROR HANDLER --------------------
// Make sure this exports a function
app.use(errorHandler);






// -------------------- START SERVER --------------------
const startServer = () => {
    try {
        app.listen(config.PORT, () => {
            Logger.info(
                `${config.SERVICE_NAME} is running on port ${config.PORT}`
            );
        });
    } catch (error) {
        Logger.error("Error starting Train Service:", error);
        process.exit(1);
    }
};

startServer();
