
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');

const Logger = require("./Config/logger");
const {config}  = require('./Config/index');

const corsMiddleware = require("./Middleware/CorsMiddleware");

const reqLogger = require("./Middleware/req.middleware");

const errorHandler = require('./Middleware/error.middleware');
const app = express();
const PORT = 4001;

const AuthRouter = require('./routers/auth.router');
const router = require('./routers/User.router');

// -------------------- MIDDLEWARE --------------------
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(helmet());
app.use(reqLogger);
app.use(cors());
app.use(corsMiddleware);
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth/opt", AuthRouter);
app.use("/api/auth/user",router);




// -------------------- ROUTES --------------------
app.get('/', (req, res) => {
    res.send('User-Service is live now');
});


app.get("/health", (req, res) => {
    res.status(200).json({
        status: "UP",
        message: "User Service is healthy"
    });
});

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
        Logger.error("Error starting User Service:", error);
        process.exit(1);
    }
};

startServer();
