import { Types } from "mongoose";
import { ApiError } from "../errors/ApiError";
import { Run, RunDocument, RoutePoint } from "../models/Run";
import { formatDuration } from "../utils/duration";

const toRunSummary = (run: RunDocument) => ({
  id: run._id.toString(),
  title: run.title,
  activityType: run.activityType,
  distanceKm: run.distanceKm,
  durationSeconds: run.durationSeconds,
  durationFormatted: formatDuration(run.durationSeconds),
  calories: run.calories,
  heartRateBpm: run.heartRateBpm,
  steps: run.steps,
  startedAt: run.startedAt,
});

const toRunDetail = (run: RunDocument) => ({
  ...toRunSummary(run),
  createdAt: run.createdAt,
  updatedAt: run.updatedAt,
});

export const parseRunId = (id: string): Types.ObjectId => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid run id", "INVALID_RUN_ID");
  }

  return new Types.ObjectId(id);
};

const getOwnedRunOrThrow = async (deviceId: string, id: string): Promise<RunDocument> => {
  const runId = parseRunId(id);
  const run = await Run.findOne({ _id: runId, deviceId });

  if (!run) {
    throw new ApiError(404, "Run not found", "RUN_NOT_FOUND");
  }

  return run;
};

export const getCurrentRun = async (deviceId: string) => {
  let run = await Run.findOne({ deviceId }).sort({ startedAt: -1 });

  if (!run) {
    const demoRun = await Run.findOne().sort({ startedAt: -1 });

    if (demoRun) {
      run = await Run.create({
        deviceId,
        title: demoRun.title,
        activityType: demoRun.activityType,
        distanceKm: demoRun.distanceKm,
        durationSeconds: demoRun.durationSeconds,
        calories: demoRun.calories,
        heartRateBpm: demoRun.heartRateBpm,
        steps: demoRun.steps,
        startedAt: demoRun.startedAt,
        route: demoRun.route.map((point) => ({
          latitude: point.latitude,
          longitude: point.longitude,
          order: point.order,
        })),
      });
    }
  }

  if (!run) {
    throw new ApiError(404, "Run not found", "RUN_NOT_FOUND");
  }

  return toRunSummary(run);
};

export const getRunById = async (deviceId: string, id: string) => {
  const run = await getOwnedRunOrThrow(deviceId, id);

  return toRunDetail(run);
};

export const getRunRoute = async (deviceId: string, id: string) => {
  const run = await getOwnedRunOrThrow(deviceId, id);
  const route = [...run.route].sort((a: RoutePoint, b: RoutePoint) => a.order - b.order);

  return {
    runId: run._id.toString(),
    route,
  };
};
