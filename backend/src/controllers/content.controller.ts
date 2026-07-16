import { RequestHandler } from "express";
import { getPlaceholderContent } from "../services/content.service";

export const getPlaceholderContentController: RequestHandler = async (_req, res, next) => {
  try {
    const content = await getPlaceholderContent();

    res.json({
      success: true,
      data: content,
    });
  } catch (error) {
    next(error);
  }
};
