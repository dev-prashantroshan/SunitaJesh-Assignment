import { Document, Schema, model } from "mongoose";

export interface OnboardingAnswerDocument extends Document {
  deviceId: string;
  stepId: number;
  selectedOptionIds: string[];
  details?: string;
  createdAt: Date;
  updatedAt: Date;
}

const onboardingAnswerSchema = new Schema<OnboardingAnswerDocument>(
  {
    deviceId: { type: String, required: true },
    stepId: { type: Number, required: true },
    selectedOptionIds: [{ type: String }],
    details: { type: String, maxlength: 250 },
  },
  { timestamps: true }
);

onboardingAnswerSchema.index({ deviceId: 1, stepId: 1 }, { unique: true });

export const OnboardingAnswer = model<OnboardingAnswerDocument>(
  "OnboardingAnswer",
  onboardingAnswerSchema
);
