import { Router } from 'express'
import content from '../middleware/content.js'
import admin from '../middleware/admin.js'
import * as auth from '../middleware/auth.js'
import { register, login, logout, extend, getUser, getAllUser, deleteUser, editUser, editCartProduct, editCartSeat, getCartProduct, getCartSeat } from '../controllers/users.js'

const router = Router()

router.post('/', content('application/json'), register)
router.post('/login', content('application/json'), auth.login, login)
router.delete('/logout', auth.jwt, logout)

router.patch('/extend', auth.jwt, extend)
router.get('/me', auth.jwt, getUser)
router.get('/all', auth.jwt, admin, getAllUser)
router.delete('/:id', auth.jwt, admin, deleteUser)
router.patch('/:id', content('application/json'), auth.jwt, editUser)

router.post('/CartProduct', content('application/json'), auth.jwt, editCartProduct)
router.post('/CartSeat', content('application/json'), auth.jwt, editCartSeat)
router.get('/CartProduct', auth.jwt, getCartProduct)
router.get('/CartSeat', auth.jwt, getCartSeat)

export default router
