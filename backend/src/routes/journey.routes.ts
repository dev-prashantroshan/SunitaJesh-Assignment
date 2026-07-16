import { Router } from "express";
import {
  favoriteJourney,
  getJourney,
  listJourneys,
  unfavoriteJourney,
} from "../controllers/journey.controller";
import { requireDeviceId } from "../middleware/device.middleware";

const router = Router();

router.use(requireDeviceId);

router.get("/", listJourneys);
router.get("/:id", getJourney);
router.post("/:id/favorite", favoriteJourney);
router.delete("/:id/favorite", unfavoriteJourney);

export default router;
