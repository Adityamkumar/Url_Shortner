import { Router } from "express";
import {
  generateShortId,
  redirectToOriginalUrl,
} from "../controllers/url.controller.js";
import { rateLimiter } from "../middlewares/rateLimiter.js";
import { getAnalytics } from "../controllers/analytics.controller.js";
const router = Router();

router.post("/shortId", rateLimiter, generateShortId);
router.get("/:shortId", redirectToOriginalUrl);
router.get('/analytics/:shortId', getAnalytics)
export default router;
