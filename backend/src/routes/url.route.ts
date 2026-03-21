import express, { Router } from 'express'
import { generateShortId } from '../controllers/url.controller.js'
const router = express.Router()

router.post('/shortId', generateShortId)

export default router