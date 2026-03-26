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

  const payload = customAlias ? { originalUrl, customAlias } : { originalUrl };
  if (!originalUrl?.trim()) {
    throw new ApiError(400, "Url is required");
  }
  const { shortId, isNew, isCustom, visitCount } =
    await createShortUrlService(payload);

  const shortUrl = `${req.protocol}://${req.get("host")}/api/v1/${shortId}`;

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
  const cachedUrl = await redisClient.get(`shortId:${cacheKey}`);

  if (cachedUrl) {
    console.log("✅ Cache Hit");

    const exists = await UrlModel.exists({ shortId });
    if (!exists) {
      await redisClient.del(shortId);
      throw new ApiError(400, "Url not found");
    }

    await UrlModel.updateOne({ shortId }, { $inc: { visitCount: 1 } });
    return res.redirect(cachedUrl);
  }

  const urlDoc = await UrlModel.findOneAndUpdate(
    { shortId },
    {
      $inc: {
        visitCount: 1,
      },
    },
    {
      new: true,
    },
  );

  if (!urlDoc) {
    throw new ApiError(404, "Url not found");
  }

  //store in Redis for the next time
  await redisClient.set(`shortId:${shortId}`, urlDoc.originalUrl, {
    EX: TTL,
  });

  res.redirect(urlDoc.originalUrl);
});
