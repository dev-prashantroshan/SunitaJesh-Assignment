import { Document, Schema, model } from "mongoose";
import { STEP_TYPES } from "../constants/onboarding.constants";

export interface StepOption {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  image?: string;
  metadata?: Record<string, unknown>;
}

export interface StepDocument extends Document {
  stepId: number;
  title: string;
  question: string;
  helperText: string;
  type?: string;
  options: StepOption[];
  minSelections?: number;
  maxSelections?: number;
  allowDetails: boolean;
  detailsMaxLength?: number;
}

const stepOptionSchema = new Schema<StepOption>(
  {
    id: { type: String },
    label: { type: String },
    description: { type: String },
    icon: { type: String },
    image: { type: String },
    metadata: { type: Schema.Types.Mixed },
  },
  { _id: false }
);

const stepSchema = new Schema<StepDocument>(
  {
    stepId: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    question: { type: String, required: true },
    helperText: { type: String, required: true },
    type: {
      type: String,
      enum: [STEP_TYPES.MULTI_SELECT, STEP_TYPES.SINGLE_SELECT, STEP_TYPES.YES_NO],
    },
    options: [stepOptionSchema],
    minSelections: { type: Number },
    maxSelections: { type: Number },
    allowDetails: { type: Boolean, default: false },
    detailsMaxLength: { type: Number },
  },
  { timestamps: false }
);

export const Step = model<StepDocument>("Step", stepSchema);
