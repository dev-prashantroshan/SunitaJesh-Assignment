import cors from "cors";
import express from "express";
import { ApiError } from "./errors/ApiError";
import { errorHandler } from "./middleware/error.middleware";
import contentRoutes from "./routes/content.routes";
import healthRoutes from "./routes/health.routes";
import journeyRoutes from "./routes/journey.routes";
import onboardingRoutes from "./routes/onboarding.routes";
import runRoutes from "./routes/run.routes";
import stepRoutes from "./routes/step.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/health", healthRoutes);
app.use("/api/steps", stepRoutes);
app.use("/api/onboarding", onboardingRoutes);
app.use("/api/journeys", journeyRoutes);
app.use("/api/runs", runRoutes);
app.use("/api/content", contentRoutes);

app.use((_req, _res, next) => {
  next(new ApiError(404, "Route not found"));
});

app.use(errorHandler);

export default app;
