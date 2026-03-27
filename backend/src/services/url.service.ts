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

  if (!customAlias) {
    const cachedKey = `Url:Auto:${originalUrl}`;
    const cachedShortId = await redisClient.get<string>(cachedKey);
    if (cachedShortId) {
      const existing = await UrlModel.findOne({ shortId: cachedShortId });
      return { 
        shortId: cachedShortId, 
        isNew: false, 
        isCustom: existing?.isCustom || false, 
        visitCount: existing?.visitCount || 0 
      };
    }

    const existing = await UrlModel.findOne({ originalUrl, isCustom: false });
    if (existing) {
      await redisClient.set(cachedKey, existing.shortId);
      await redisClient.expire(cachedKey, TTL)
      await redisClient.set(`shortId:${existing.shortId}`, originalUrl);
      await redisClient.expire(`shortId:${existing.shortId}`, TTL)
      return {
        shortId: existing.shortId,
        isNew: false,
        isCustom: existing.isCustom,
        visitCount: existing.visitCount,
      };
    }
  }

  const shortId: string = customAlias ? customAlias : nanoid(6);

  let urlDoc;
  try {
    urlDoc = await UrlModel.create({
      originalUrl: originalUrl,
      shortId: shortId,
      isCustom: !!customAlias,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      // If it's a duplication, find existing regardless of isCustom for final fallback
      urlDoc = await UrlModel.findOne({ originalUrl, shortId: shortId });
    } else {
      throw error;
    }
  }
  if (!urlDoc) {
    throw new ApiError(500, "Failed to create or fetch URL");
  }

  // Only cache the URL-to-ID mapping for AUTO-generated links
  // Custom aliases should not be mapped back as the 'default' for a URL
  if (!urlDoc.isCustom) {
    await redisClient.set(`Url:Auto:${urlDoc.originalUrl}`, urlDoc.shortId);
    await redisClient.expire(`Url:Auto:${urlDoc.originalUrl}`, TTL)
  }
  
  await redisClient.set(`shortId:${urlDoc.shortId}`, urlDoc.originalUrl);
  await redisClient.expire(`shortId:${urlDoc.shortId}`, TTL)
  return {
    shortId: urlDoc.shortId,
    isNew: true,
    isCustom: urlDoc.isCustom,
    visitCount: urlDoc.visitCount,
  };
};
