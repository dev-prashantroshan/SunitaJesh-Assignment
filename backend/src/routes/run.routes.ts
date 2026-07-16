import { Router } from "express";
import {
  getCurrentRunController,
  getRunController,
  getRunRouteController,
} from "../controllers/run.controller";
import { requireDeviceId } from "../middleware/device.middleware";

const router = Router();

router.use(requireDeviceId);

router.get("/current", getCurrentRunController);
router.get("/:id/route", getRunRouteController);
router.get("/:id", getRunController);

export default router;
