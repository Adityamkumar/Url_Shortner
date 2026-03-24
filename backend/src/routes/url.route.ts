import { Router } from "express";
import {
  generateShortId,
  redirectToOriginalUrl,
} from "../controllers/url.controller.js";
import { rateLimiter } from "../middlewares/rateLimiter.js";
const router = Router();

router.post("/shortId", rateLimiter, generateShortId);
router.get("/:shortId", redirectToOriginalUrl);

export default router;
