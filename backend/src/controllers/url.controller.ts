import { nanoid } from "nanoid";
import { UrlModel } from "../models/url.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import redisClient from "../utils/redisClient.js";

export const generateShortId = asyncHandler(async (req, res) => {
  const originalUrl: string = req.body.originalUrl;
  if (!originalUrl?.trim()) {
    throw new ApiError(400, "Url is required");
  }
  try {
    new URL(originalUrl);
  } catch {
    throw new ApiError(400, "Invalid URL");
  }

  const shortId: string = nanoid(6);

  const url = await UrlModel.create({
    originalUrl: originalUrl,
    shortId: shortId,
  });

  const shortUrl = `${req.protocol}://${req.get("host")}/api/v1/${shortId}`;

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { shortId: shortId, shortUrl: shortUrl },
        "Url Shortened Successfully",
      ),
    );
});

export const redirectToOriginalUrl = asyncHandler(async (req, res) => {
  const shortId = req.params.shortId as string;
  if (!shortId) {
    throw new ApiError(400, "ShortId is required");
  }

  const cachedUrl = await redisClient.get(shortId);

  if (cachedUrl) {
    console.log("✅ Cache Hit");

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
  await redisClient.set(shortId, urlDoc.originalUrl, {
    EX: 3600,
  });

  res.redirect(urlDoc.originalUrl);
});
