import { OnboardingAnswer } from "../models/OnboardingAnswer";
import { Step, StepDocument } from "../models/Step";
import { ApiError } from "../errors/ApiError";
import { HEALTH_OPTION_IDS, STEP_TYPES } from "../constants/onboarding.constants";

interface AnswerBody {
  selectedOptionIds?: unknown;
  details?: unknown;
}

const ONBOARDING_STEP_FILTER = { stepId: { $gte: 2, $lte: 8 } };

export const parseStepId = (stepId: string): number => {
  const parsedStepId = Number(stepId);

  if (!Number.isInteger(parsedStepId) || parsedStepId <= 0) {
    throw new ApiError(400, "Invalid step id", "INVALID_STEP_ID");
  }

  return parsedStepId;
};

export const getProgress = async (deviceId: string) => {
  const [steps, answers] = await Promise.all([
    Step.find(ONBOARDING_STEP_FILTER).sort({ stepId: 1 }),
    OnboardingAnswer.find({ deviceId }).sort({ stepId: 1 }),
  ]);

  const stepIds = steps.map((step) => step.stepId);
  const stepIdSet = new Set(stepIds);
  const onboardingAnswers = answers.filter((answer) => stepIdSet.has(answer.stepId));
  const answeredStepIds = onboardingAnswers.map((answer) => answer.stepId);
  const answeredStepIdSet = new Set(answeredStepIds);
  const completedSteps = onboardingAnswers.length;
  const totalSteps = steps.length;
  const currentStep = stepIds.find((stepId) => !answeredStepIdSet.has(stepId)) ?? null;
  const isCompleted = totalSteps > 0 && completedSteps === totalSteps;
  const progressPercentage = isCompleted
    ? 100
    : Math.round((completedSteps / totalSteps) * 100);

  return {
    answers: onboardingAnswers,
    answeredStepIds,
    currentStep,
    completedSteps,
    totalSteps,
    progressPercentage,
    isCompleted,
  };
};

export const getNextStepProgress = async (deviceId: string) => {
  const progress = await getProgress(deviceId);

  return {
    completedSteps: progress.completedSteps,
    totalSteps: progress.totalSteps,
    progressPercentage: progress.progressPercentage,
    nextStep: progress.currentStep,
    isCompleted: progress.isCompleted,
  };
};

const getStepOrThrow = async (stepId: number): Promise<StepDocument> => {
  const step = await Step.findOne({ stepId });

  if (!step) {
    throw new ApiError(404, "Step not found", "STEP_NOT_FOUND");
  }

  return step;
};

const validateSelectedOptions = (step: StepDocument, selectedOptionIds: unknown): string[] => {
  if (!Array.isArray(selectedOptionIds)) {
    throw new ApiError(400, "selectedOptionIds must be an array", "VALIDATION_ERROR");
  }

  const optionIds = selectedOptionIds.map((optionId) => {
    if (typeof optionId !== "string") {
      throw new ApiError(400, "selectedOptionIds must contain strings", "VALIDATION_ERROR");
    }

    return optionId;
  });

  if (new Set(optionIds).size !== optionIds.length) {
    throw new ApiError(400, "Duplicate option ids are not allowed", "VALIDATION_ERROR");
  }

  const validOptionIds = new Set(step.options.map((option) => option.id));
  const hasInvalidOption = optionIds.some((optionId) => !validOptionIds.has(optionId));

  if (hasInvalidOption) {
    throw new ApiError(400, "One or more selected options are invalid", "INVALID_OPTION");
  }

  if (step.type === STEP_TYPES.SINGLE_SELECT || step.type === STEP_TYPES.YES_NO) {
    if (optionIds.length !== 1) {
      throw new ApiError(400, "This step requires exactly one selected option", "INVALID_SELECTION_COUNT");
    }

    return optionIds;
  }

  const minSelections = step.minSelections ?? 0;
  const maxSelections = step.maxSelections;

  if (optionIds.length < minSelections || (maxSelections !== undefined && optionIds.length > maxSelections)) {
    throw new ApiError(400, "Invalid number of selected options", "INVALID_SELECTION_COUNT");
  }

  return optionIds;
};

const prepareDetails = (step: StepDocument, selectedOptionIds: string[], details: unknown): string | undefined => {
  if (details !== undefined && typeof details !== "string") {
    throw new ApiError(400, "details must be a string", "VALIDATION_ERROR");
  }

  const detailsText = details ?? "";

  if (!step.allowDetails) {
    if (typeof detailsText === "string" && detailsText.trim().length > 0) {
      throw new ApiError(400, "Details are not allowed for this step", "DETAILS_NOT_ALLOWED");
    }

    return undefined;
  }

  if (typeof detailsText === "string" && step.detailsMaxLength && detailsText.length > step.detailsMaxLength) {
    throw new ApiError(400, "Details are too long", "DETAILS_TOO_LONG");
  }

  if (step.stepId === 6) {
    const selectedOption = step.options.find((option) => option.id === selectedOptionIds[0]);
    const selectedYes = selectedOption?.id === HEALTH_OPTION_IDS.HEALTH_YES;

    if (selectedYes && detailsText.trim().length === 0) {
      throw new ApiError(400, "Details are required when a health condition is selected", "DETAILS_REQUIRED");
    }

    return selectedYes ? detailsText : undefined;
  }

  return typeof detailsText === "string" && detailsText.length > 0 ? detailsText : undefined;
};

export const saveOnboardingAnswer = async (deviceId: string, stepId: number, body: AnswerBody) => {
  const step = await getStepOrThrow(stepId);
  const selectedOptionIds = validateSelectedOptions(step, body.selectedOptionIds);
  const details = prepareDetails(step, selectedOptionIds, body.details);
  const update = {
    $set: {
      deviceId,
      stepId,
      selectedOptionIds,
      ...(details !== undefined ? { details } : {}),
    },
    ...(details === undefined ? { $unset: { details: "" } } : {}),
  };

  return OnboardingAnswer.findOneAndUpdate(
    { deviceId, stepId },
    update,
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  );
};
