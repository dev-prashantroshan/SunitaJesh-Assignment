import { Document, Schema, model } from "mongoose";

export interface JourneyDocument extends Document {
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  durationWeeks: number;
  difficulty: string;
  activities: string[];
  benefits: string[];
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const journeySchema = new Schema<JourneyDocument>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    imageUrl: { type: String, required: true },
    durationWeeks: { type: Number, required: true },
    difficulty: {
      type: String,
      required: true,
      enum: ["Beginner", "Intermediate", "Advanced"],
    },
    activities: [{ type: String }],
    benefits: [{ type: String }],
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Journey = model<JourneyDocument>("Journey", journeySchema);
