//   in here what actually do : to log everthings related to HTTP requests mean prodiuction grid 
// 1. log the request method and URL
// 2. log the response status code and duration of the request
// this is useful for debugging and monitoring the performance of the application, especially in a production environment where you want to keep track of how your application is performing and identify any issues that may arise.    
// we are using the logger from the ConfigLogger file to log the information, and we are using the 'finish' event of the response object to log the response status code and duration after the response has been sent to the client.
// we are also calling the next() function to pass control to the next middleware function in the stack, allowing the request to continue through the application.
// overall, this middleware is a useful tool for monitoring and debugging the performance of the application, and it can help identify any issues that may arise in production.




const logger = require('../Config/Logger');
const reqLogger = (req, res, next) => {
    logger.debug(`Request Method: ${req.method}, Request URL: ${req.originalUrl}`);
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info(
            `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`
        );
    });
     next();
}



module.exports = reqLogger;
