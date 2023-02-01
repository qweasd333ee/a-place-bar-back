import { Router } from 'express'
import content from '../middleware/content.js'

const router = Router()

router.post('/', content('application/json'))

export default router
