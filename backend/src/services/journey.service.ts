import { Types } from "mongoose";
import { ApiError } from "../errors/ApiError";
import { Journey, JourneyDocument } from "../models/Journey";
import { JourneyFavorite } from "../models/JourneyFavorite";

const toJourneyCard = (journey: JourneyDocument, favoriteIds: Set<string>) => ({
  id: journey._id.toString(),
  title: journey.title,
  description: journey.description,
  category: journey.category,
  imageUrl: journey.imageUrl,
  durationWeeks: journey.durationWeeks,
  difficulty: journey.difficulty,
  featured: journey.featured,
  isFavorite: favoriteIds.has(journey._id.toString()),
});

const toJourneyDetail = (journey: JourneyDocument, isFavorite: boolean) => ({
  id: journey._id.toString(),
  title: journey.title,
  description: journey.description,
  category: journey.category,
  imageUrl: journey.imageUrl,
  durationWeeks: journey.durationWeeks,
  difficulty: journey.difficulty,
  activities: journey.activities,
  benefits: journey.benefits,
  featured: journey.featured,
  isFavorite,
});

export const parseJourneyId = (id: string): Types.ObjectId => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid journey id", "INVALID_JOURNEY_ID");
  }

  return new Types.ObjectId(id);
};

const getJourneyOrThrow = async (journeyId: Types.ObjectId): Promise<JourneyDocument> => {
  const journey = await Journey.findById(journeyId);

  if (!journey) {
    throw new ApiError(404, "Journey not found", "JOURNEY_NOT_FOUND");
  }

  return journey;
};

export const getJourneys = async (deviceId: string) => {
  const [journeys, favorites] = await Promise.all([
    Journey.find().sort({ featured: -1, createdAt: -1 }),
    JourneyFavorite.find({ deviceId }).select("journeyId"),
  ]);

  const favoriteIds = new Set(favorites.map((favorite) => favorite.journeyId.toString()));

  return journeys.map((journey) => toJourneyCard(journey, favoriteIds));
};

export const getJourneyById = async (deviceId: string, id: string) => {
  const journeyId = parseJourneyId(id);
  const journey = await getJourneyOrThrow(journeyId);
  const favorite = await JourneyFavorite.findOne({ deviceId, journeyId });

  return toJourneyDetail(journey, Boolean(favorite));
};

export const addJourneyFavorite = async (deviceId: string, id: string) => {
  const journeyId = parseJourneyId(id);

  await getJourneyOrThrow(journeyId);
  await JourneyFavorite.findOneAndUpdate(
    { deviceId, journeyId },
    { deviceId, journeyId },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return {
    journeyId: journeyId.toString(),
    isFavorite: true,
  };
};

export const removeJourneyFavorite = async (deviceId: string, id: string) => {
  const journeyId = parseJourneyId(id);

  await getJourneyOrThrow(journeyId);
  await JourneyFavorite.deleteOne({ deviceId, journeyId });

  return {
    journeyId: journeyId.toString(),
    isFavorite: false,
  };
};
