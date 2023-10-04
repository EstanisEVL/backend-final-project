import winston from "winston";
import { NODE_ENV } from "../config/config.js";

const customLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "black",
    error: "red",
    warning: "yellow",
    info: "blue",
    http: "magenta",
    debug: "white",
  },
};

const devLogger = winston.createLogger({
  levels: customLevels.levels,
  transports: [new winston.transports.Console({ level: "debug" })],
  format: winston.format.combine(
    winston.format.colorize({ colors: customLevels.colors }),
    winston.format.simple()
  ),
});

const prodLogger = winston.createLogger({
  levels: customLevels.levels,
  transports: [
    new winston.transports.Console({ level: "info" }),
    new winston.transports.File({
      filename: `./errors/errors.log`,
      level: "error",
    }),
  ],
  format: winston.format.combine(
    winston.format.colorize({ colors: customLevels.colors }),
    winston.format.simple()
  ),
});

const loggerLevels = {
  development: devLogger,
  qa: devLogger,
  production: prodLogger,
};

export const setLogger = (req, res, next) => {
  req.logger = loggerLevels[`${NODE_ENV}`];
  next();
};
