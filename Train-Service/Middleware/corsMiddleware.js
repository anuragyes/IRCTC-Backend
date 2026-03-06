const cors = require('cors');
const config = require("../Config/index");

const corsMiddleware = cors({
    origin: config.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept'
    ],
    credentials: true,
});

module.exports = corsMiddleware;
