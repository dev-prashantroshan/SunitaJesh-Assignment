import { Document, Schema, Types, model } from "mongoose";

export interface JourneyFavoriteDocument extends Document {
  deviceId: string;
  journeyId: Types.ObjectId;
  createdAt: Date;
}

const journeyFavoriteSchema = new Schema<JourneyFavoriteDocument>(
  {
    deviceId: { type: String, required: true },
    journeyId: {
      type: Schema.Types.ObjectId,
      ref: "Journey",
      required: true,
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

journeyFavoriteSchema.index({ deviceId: 1, journeyId: 1 }, { unique: true });

export const JourneyFavorite = model<JourneyFavoriteDocument>(
  "JourneyFavorite",
  journeyFavoriteSchema
);
