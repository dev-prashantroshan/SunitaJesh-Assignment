import { Router } from "express";
import { getStepById, getSteps } from "../controllers/step.controller";

const router = Router();

router.get("/", getSteps);
router.get("/:stepId", getStepById);

export default router;
