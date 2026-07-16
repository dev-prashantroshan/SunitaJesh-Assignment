import { RequestHandler } from "express";
import { ApiError } from "../errors/ApiError";
import { Step } from "../models/Step";
import { parseStepId } from "../services/onboarding.service";

export const getSteps: RequestHandler = async (_req, res, next) => {
  try {
    const steps = await Step.find().sort({ stepId: 1 });

    res.json({
      success: true,
      data: { steps },
    });
  } catch (error) {
    next(error);
  }
};

export const getStepById: RequestHandler = async (req, res, next) => {
  try {
    const stepId = parseStepId(req.params.stepId);
    const step = await Step.findOne({ stepId });

    if (!step) {
      throw new ApiError(404, "Step not found", "STEP_NOT_FOUND");
    }

    res.json({
      success: true,
      data: { step },
    });
  } catch (error) {
    next(error);
  }
};
