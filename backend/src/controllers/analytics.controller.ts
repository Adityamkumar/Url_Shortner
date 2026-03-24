import { UrlModel } from "../models/url.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";


export const getAnalytics = asyncHandler(async (req, res) => {
  const shortId = req.params.shortId as string;

  const urlDoc = await UrlModel.findOne({ shortId });

  if (!urlDoc) {
    throw new ApiError(404, "URL not found");
  }

  return res.json({
    visitCount: urlDoc.visitCount,
  });
});