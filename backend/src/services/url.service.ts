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
    const cachedKey = `Url:${originalUrl}`;
    const cached = await redisClient.get<string>(cachedKey);
    if (cached) {
      return { shortId: cached, isNew: false, isCustom: false, visitCount: 0 };
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
      urlDoc = await UrlModel.findOne({ originalUrl, isCustom: false });
    } else {
      throw error;
    }
  }
  if (!urlDoc) {
    throw new ApiError(500, "Failed to create or fetch URL");
  }

  await redisClient.set(`Url: ${urlDoc.originalUrl}`, urlDoc.shortId);
  await redisClient.set(`shortId:${urlDoc.shortId}`, urlDoc.originalUrl);
  return {
    shortId: urlDoc.shortId,
    isNew: true,
    isCustom: urlDoc.isCustom,
    visitCount: urlDoc.visitCount,
  };
};
