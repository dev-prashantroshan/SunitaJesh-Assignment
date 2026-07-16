import { ErrorRequestHandler } from "express";
import { env } from "../config/env";
import { ApiError } from "../errors/ApiError";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const message = err instanceof ApiError ? err.message : "Internal server error";
  const code = err instanceof ApiError ? err.code : "INTERNAL_SERVER_ERROR";

  res.status(statusCode).json({
    success: false,
    error: {
      ...(code && { code }),
      message,
      ...(env.nodeEnv === "development" &&
        (!(err instanceof ApiError) || err.exposeStack) && { stack: err.stack }),
    },
  });
};
