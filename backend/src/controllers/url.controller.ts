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
  const { shortId } = req.params;

  const systemFiles = ['favicon.ico', 'robots.txt', 'sitemap.xml', '.well-known', 'manifest.json'];
  if (!shortId || systemFiles.some(file => shortId.includes(file))) {
    throw new ApiError(400, "Not a short URL")
  }

  const cacheKey = `shortId:${shortId}`;
  const cachedUrl = await redisClient.get<string>(cacheKey);

  if (cachedUrl) {
    console.log(`🚀 Redirecting (Cache Hit): ${shortId}`);

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
      return res.redirect(cachedUrl);
    } else {
      await redisClient.del(cacheKey); // Stale cache
    }
  }

  // Cache Miss or Staleness
  console.log(`🔍 Redirection (DB Lookup): ${shortId}`);
  const urlDoc = await UrlModel.findOneAndUpdate(
    { shortId },
    { $inc: { visitCount: 1 } },
    { new: true }
  );

  if (!urlDoc) {
    throw new ApiError(404, "Short URL not found");
  }

  // Populate both cache layers
  await redisClient.set(cacheKey, urlDoc.originalUrl);
  await redisClient.expire(cacheKey, TTL);

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
