import { Document, Schema, model } from "mongoose";

export interface RoutePoint {
  latitude: number;
  longitude: number;
  order: number;
}

export interface RunDocument extends Document {
  deviceId: string;
  title: string;
  activityType: string;
  distanceKm: number;
  durationSeconds: number;
  calories: number;
  heartRateBpm: number;
  steps: number;
  startedAt: Date;
  route: RoutePoint[];
  createdAt: Date;
  updatedAt: Date;
}

const routePointSchema = new Schema<RoutePoint>(
  {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    order: { type: Number, required: true },
  },
  { _id: false }
);

const runSchema = new Schema<RunDocument>(
  {
    deviceId: { type: String, required: true },
    title: { type: String, required: true },
    activityType: {
      type: String,
      required: true,
      enum: ["running"],
    },
    distanceKm: { type: Number, required: true },
    durationSeconds: { type: Number, required: true },
    calories: { type: Number, required: true },
    heartRateBpm: { type: Number, required: true },
    steps: { type: Number, required: true },
    startedAt: { type: Date, required: true },
    route: [routePointSchema],
  },
  { timestamps: true }
);

export const Run = model<RunDocument>("Run", runSchema);
