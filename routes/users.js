import { Router } from 'express'
import content from '../middleware/content.js'
import * as auth from '../middleware/auth.js'
import { register, login, logout, extend, getUser, editCartProduct, editCartSeat, getCartProduct, getCartSeat } from '../controllers/users.js'

const router = Router()

router.post('/', content('application/json'), register)
router.post('/login', content('application/json'), auth.login, login)
router.delete('/logout', auth.jwt, logout)
router.patch('/extend', auth.jwt, extend)
router.get('/me', auth.jwt, getUser)
router.post('/CartProduct', content('application/json'), auth.jwt, editCartProduct)
router.post('/CartSeat', content('application/json'), auth.jwt, editCartSeat)
router.get('/CartProduct', auth.jwt, getCartProduct)
router.get('/CartSeat', auth.jwt, getCartSeat)

export default router
