import { Router } from 'express'
import content from '../middleware/content.js'
import admin from '../middleware/admin.js'
import upload from '../middleware/upload.js'
import { jwt } from '../middleware/auth.js'
import { createSeat, getUsingSeats, getAllSeats, getSeat, editSeat } from '../controllers/seats.js'

const router = Router()

router.post('/', content('multipart/form-data'), jwt, admin, upload, createSeat)
router.get('/', getUsingSeats)
router.get('/all', jwt, admin, getAllSeats)
router.get('/:id', getSeat)
router.patch('/:id', content('multipart/form-data'), jwt, admin, upload, editSeat)

export default router
