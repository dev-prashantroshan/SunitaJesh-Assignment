import { Router } from "express";
import { getOnboarding, upsertOnboardingAnswer } from "../controllers/onboarding.controller";
import { requireDeviceId } from "../middleware/device.middleware";

const router = Router();

router.use(requireDeviceId);

router.get("/", getOnboarding);
router.put("/answers/:stepId", upsertOnboardingAnswer);

export default router;
