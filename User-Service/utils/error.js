const { AppError } = require("./errorTypes");

module.exports = (err, req, res, next) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: "error",
            message: err.message,
        });
    }

    console.error(err);

    res.status(500).json({
        status: "error",
        message: "Internal Server Error",
    });
};
