import { nanoid } from "nanoid";
import { UrlModel } from "../models/url.model.js";
import { ApiError } from "../utils/ApiError.js";
import redisClient from "../utils/redisClient.js";
import { validateAlias } from "../utils/validators/aliasValidator.js";
import type {
  CreateShortUrlBody,
  CreatShortUrlResult,
} from "../utils/types/url.type.js";

const TTL = Number(process.env.REDIS_TTL || 3600);

export const createShortUrlService = async ({
  originalUrl,
  customAlias,
}: CreateShortUrlBody): Promise<CreatShortUrlResult> => {

  await validateAlias(customAlias);

  try {
    new URL(originalUrl);
  } catch {
    throw new ApiError(400, "Invalid URL");
  }

  const cachedKey = `Url:${originalUrl}`;
  
  // 1. If no custom alias, check if we have a clean cached version
  if (!customAlias) {
    const cachedData = await redisClient.get<string>(cachedKey);
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        return { 
          shortId: parsed.shortId, 
          isNew: false, 
          isCustom: parsed.isCustom || false, 
          visitCount: parsed.visitCount || 0 
        };
      } catch (e) {
      }
    }
  }

  const shortId: string = customAlias ? customAlias : nanoid(6);

  let urlDoc;
  if (!customAlias) {
    urlDoc = await UrlModel.findOneAndUpdate(
      { originalUrl, isCustom: false },
      { $setOnInsert: { shortId, originalUrl, isCustom: false, visitCount: 0 } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  } else {
    try {
      urlDoc = await UrlModel.create({ originalUrl, shortId, isCustom: true, visitCount: 0 });
    } catch (error: any) {
      if (error.code === 11000) {
        throw new ApiError(400, "Slug/Alias already in use. Please pick another.");
      }
      throw error;
    }
  }

  const isNew = urlDoc.visitCount === 0;

  const result: CreatShortUrlResult = {
    shortId: urlDoc.shortId,
    isNew: isNew,
    isCustom: urlDoc.isCustom,
    visitCount: urlDoc.visitCount || 0,
  };

  const cacheData = JSON.stringify(result);
  await redisClient.set(cachedKey, cacheData);
  await redisClient.expire(cachedKey, TTL);
  
  await redisClient.set(`shortId:${urlDoc.shortId}`, urlDoc.originalUrl);
  await redisClient.expire(`shortId:${urlDoc.shortId}`, TTL);

  return result;
};
