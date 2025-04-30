import { ErrorRequestHandler } from "express";
import config from "../../config";

const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  const statusCode = error?.statusCode || 500;
  const message = error?.message || "Something went wrong";
  const stack = error?.stack || "No stack trace available";
  res.status(statusCode).json({
    success: false,
    message: message || "Something went wrong",
    stack: config.env === "development" ? stack : undefined,
  });
};

export default globalErrorHandler;
