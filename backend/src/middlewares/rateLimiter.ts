import type { Request, Response, NextFunction } from "express";
import redisClient from "../utils/redisClient.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const rateLimiter = asyncHandler(
  async (req: Request, _, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    const key = `rate_limit${ip}`;

    const count = await redisClient.incr(key);

    if (count === 1) {
      await redisClient.expire(key, 60);
    }

    if (count > 5) {
      throw new ApiError(429, "Too many requests, try again later");
    }
    next();
  },
);
