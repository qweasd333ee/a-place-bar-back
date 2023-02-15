import { Router } from 'express'
import { jwt } from '../middleware/auth.js'
import admin from '../middleware/admin.js'
import { createBooking, getMyBookings, getAllBookings } from '../controllers/bookings.js'

const router = Router()

router.post('/', jwt, createBooking)
router.get('/', jwt, getMyBookings)
router.get('/all', jwt, admin, getAllBookings)

export default router
