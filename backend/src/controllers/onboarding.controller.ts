import { RequestHandler } from "express";
import { parseStepId, getProgress, getNextStepProgress, saveOnboardingAnswer } from "../services/onboarding.service";

export const getOnboarding: RequestHandler = async (req, res, next) => {
  try {
    const progress = await getProgress(req.deviceId as string);

    res.json({
      success: true,
      data: progress,
    });
  } catch (error) {
    next(error);
  }
};

export const upsertOnboardingAnswer: RequestHandler = async (req, res, next) => {
  try {
    const stepId = parseStepId(req.params.stepId);
    const answer = await saveOnboardingAnswer(req.deviceId as string, stepId, req.body);
    const progress = await getNextStepProgress(req.deviceId as string);

    res.json({
      success: true,
      data: {
        answer,
        progress,
      },
    });
  } catch (error) {
    next(error);
  }
};
