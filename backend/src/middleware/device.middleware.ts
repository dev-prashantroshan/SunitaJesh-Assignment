import { RequestHandler } from "express";
import { ApiError } from "../errors/ApiError";

export const requireDeviceId: RequestHandler = (req, _res, next) => {
  const deviceId = req.header("x-device-id");

  if (!deviceId) {
    next(new ApiError(400, "x-device-id header is required", "DEVICE_ID_REQUIRED"));
    return;
  }

  req.deviceId = deviceId;
  next();
};
