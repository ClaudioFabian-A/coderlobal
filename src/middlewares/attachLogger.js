import LoggerService from "../services/LoggerService.js";

const logger = new LoggerService("desarrollo");
const attachLogger = (req, res, next) => {
  req.logger = logger.logger;
  req.logger.http(`${req.method} en ${req.url} = ${new Date().toDateString()}`);
  next();
};

export default attachLogger;
