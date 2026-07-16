import { RequestHandler } from "express";
import { getCurrentRun, getRunById, getRunRoute } from "../services/run.service";

export const getCurrentRunController: RequestHandler = async (req, res, next) => {
  try {
    const run = await getCurrentRun(req.deviceId as string);

    res.json({
      success: true,
      data: { run },
    });
  } catch (error) {
    next(error);
  }
};

export const getRunController: RequestHandler = async (req, res, next) => {
  try {
    const run = await getRunById(req.deviceId as string, req.params.id);

    res.json({
      success: true,
      data: { run },
    });
  } catch (error) {
    next(error);
  }
};

export const getRunRouteController: RequestHandler = async (req, res, next) => {
  try {
    const routeData = await getRunRoute(req.deviceId as string, req.params.id);

    res.json({
      success: true,
      data: routeData,
    });
  } catch (error) {
    next(error);
  }
};
