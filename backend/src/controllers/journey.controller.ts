import { RequestHandler } from "express";
import {
  addJourneyFavorite,
  getJourneyById,
  getJourneys,
  removeJourneyFavorite,
} from "../services/journey.service";

export const listJourneys: RequestHandler = async (req, res, next) => {
  try {
    const journeys = await getJourneys(req.deviceId as string);

    res.json({
      success: true,
      data: { journeys },
    });
  } catch (error) {
    next(error);
  }
};

export const getJourney: RequestHandler = async (req, res, next) => {
  try {
    const journey = await getJourneyById(req.deviceId as string, req.params.id);

    res.json({
      success: true,
      data: { journey },
    });
  } catch (error) {
    next(error);
  }
};

export const favoriteJourney: RequestHandler = async (req, res, next) => {
  try {
    const favorite = await addJourneyFavorite(req.deviceId as string, req.params.id);

    res.json({
      success: true,
      data: favorite,
    });
  } catch (error) {
    next(error);
  }
};

export const unfavoriteJourney: RequestHandler = async (req, res, next) => {
  try {
    const favorite = await removeJourneyFavorite(req.deviceId as string, req.params.id);

    res.json({
      success: true,
      data: favorite,
    });
  } catch (error) {
    next(error);
  }
};
