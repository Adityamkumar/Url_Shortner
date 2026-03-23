import { Router } from 'express'
import { generateShortId, redirectToOriginalUrl } from '../controllers/url.controller.js'
const router = Router()

router.post('/shortId', generateShortId)
router.get('/:shortId', redirectToOriginalUrl)

export default router