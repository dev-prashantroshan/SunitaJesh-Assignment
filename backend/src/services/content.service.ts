import { ApiError } from "../errors/ApiError";

interface PlaceholderContent {
  title: string;
  description: string;
  source: string;
  cached: boolean;
}

const BACON_IPSUM_URL = "https://baconipsum.com/api/?type=meat-and-filler&paras=1";
const CACHE_TTL_MS = 5 * 60 * 1000;
const FETCH_TIMEOUT_MS = 5000;
const MAX_DESCRIPTION_LENGTH = 300;

let cachedContent: Omit<PlaceholderContent, "cached"> | null = null;
let cacheExpiresAt = 0;

const trimDescription = (description: string): string => {
  if (description.length <= MAX_DESCRIPTION_LENGTH) {
    return description;
  }

  return `${description.slice(0, MAX_DESCRIPTION_LENGTH - 3).trim()}...`;
};

const createExternalContentError = (): ApiError => {
  return new ApiError(
    502,
    "Unable to fetch placeholder content",
    "EXTERNAL_CONTENT_ERROR",
    { exposeStack: false }
  );
};

export const getPlaceholderContent = async (): Promise<PlaceholderContent> => {
  if (cachedContent && Date.now() < cacheExpiresAt) {
    return {
      ...cachedContent,
      cached: true,
    };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(BACON_IPSUM_URL, {
      signal: controller.signal,
    });

    if (!response.ok) {
      throw createExternalContentError();
    }

    const data = await response.json();

    if (!Array.isArray(data) || typeof data[0] !== "string") {
      throw createExternalContentError();
    }

    cachedContent = {
      title: "Daily Fitness Insight",
      description: trimDescription(data[0]),
      source: "Bacon Ipsum",
    };
    cacheExpiresAt = Date.now() + CACHE_TTL_MS;

    return {
      ...cachedContent,
      cached: false,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw createExternalContentError();
  } finally {
    clearTimeout(timeoutId);
  }
};
