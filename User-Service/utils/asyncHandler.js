
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
}

module.exports = asyncHandler;

// The purpose of this code snippet is to create a higher-order function called `asyncHandler` that wraps asynchronous route handlers in an Express application. This function takes an asynchronous function `fn` as an argument and returns a new function that handles the request, response, and next middleware. It uses `Promise.resolve` to ensure that any errors thrown by the asynchronous function are caught and passed to the next middleware (which is typically an error handler). This helps to simplify error handling in Express applications by allowing developers to write asynchronous route handlers without having to manually catch errors and pass them to the next middleware.   