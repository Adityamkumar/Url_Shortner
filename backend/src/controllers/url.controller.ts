import { UrlModel } from "../models/url.model.js";
import { createShortUrlService } from "../services/url.service.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import redisClient from "../utils/redisClient.js";
import type {
  CreateShortUrlBody,
  ShortUrlResponse,
} from "../utils/types/url.type.js";

const TTL = Number(process.env.REDIS_TTL || 3600);

export const generateShortId = asyncHandler(async (req, res) => {
  const { originalUrl, customAlias }: CreateShortUrlBody = req.body;

  if (!originalUrl?.trim()) {
    throw new ApiError(400, "Url is required");
  }

  const payload = customAlias ? { originalUrl, customAlias } : { originalUrl };
  
  const { shortId, isNew, isCustom, visitCount } = await createShortUrlService(payload);

  const shortUrl = `${req.protocol}://${req.get("host")}/${shortId}`;

  const responseData: ShortUrlResponse = {
    shortId,
    shortUrl,
    isCustom,
    visitCount,
  };

  return res
    .status(isNew ? 201 : 200)
    .json(new ApiResponse(isNew ? 201 : 200, responseData));
});

export const redirectToOriginalUrl = asyncHandler(async (req, res) => {
  const shortId = req.params.shortId as string;
  if (!shortId) {
    throw new ApiError(400, "ShortId is required");
  }

  const cacheKey = `shortId:${shortId}`;
  const cachedUrl = await redisClient.get<string>(cacheKey);

  if (cachedUrl) {
    console.log("✅ Cache Hit");

    const urlDoc = await UrlModel.findOneAndUpdate(
      { shortId },
      { $inc: { visitCount: 1 } },
      { new: true }
    );

    if (urlDoc) {
      const cachedUrlKey = `Url:${urlDoc.originalUrl}`;
      const cacheData = JSON.stringify({
        shortId: urlDoc.shortId,
        isNew: false,
        isCustom: urlDoc.isCustom,
        visitCount: urlDoc.visitCount
      });
      await redisClient.set(cachedUrlKey, cacheData);
      await redisClient.expire(cachedUrlKey, TTL);
    } else {
      await redisClient.del(cacheKey);
    }

    return res.redirect(cachedUrl);
  }

  // Cache Miss or stale cache
  const urlDoc = await UrlModel.findOneAndUpdate(
    { shortId },
    { $inc: { visitCount: 1 } },
    { new: true }
  );

  if (!urlDoc) {
    throw new ApiError(404, "Short URL not found");
  }

  // Store in Redis (Short ID -> Target URL)
  await redisClient.set(cacheKey, urlDoc.originalUrl);
  await redisClient.expire(cacheKey, TTL);

  // Sync the Original URL analytics cache
  const cachedUrlKey = `Url:${urlDoc.originalUrl}`;
  const cacheData = JSON.stringify({
    shortId: urlDoc.shortId,
    isNew: false,
    isCustom: urlDoc.isCustom,
    visitCount: urlDoc.visitCount
  });
  await redisClient.set(cachedUrlKey, cacheData);
  await redisClient.expire(cachedUrlKey, TTL);

  res.redirect(urlDoc.originalUrl);
});
