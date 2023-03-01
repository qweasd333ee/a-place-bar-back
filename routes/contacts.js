import { Router } from 'express'
import content from '../middleware/content.js'
import admin from '../middleware/admin.js'
import upload from '../middleware/upload.js'
import { jwt } from '../middleware/auth.js'
import { getAllContacts, createContact } from '../controllers/contacts.js'

const router = Router()

router.post('/', content('multipart/form-data'), jwt, admin, upload, createContact)
router.get('/all', jwt, admin, getAllContacts)

export default router
