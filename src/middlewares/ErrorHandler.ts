import { Response, Request, NextFunction } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    message: err.message,
    success: false,
    status: statusCode,
    stack: process.env.NODE_ENV === "development" ? null : err.stack,
  });
};
