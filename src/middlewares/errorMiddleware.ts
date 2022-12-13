import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { config } from '../config/config';
import Logging from '../library/Logging';

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not found : ${req.originalUrl}`);
  Logging.error(error);
  res.status(404);
  next(error);
};

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: config.stage === 'production' ? null : err.stack,
  });
};
