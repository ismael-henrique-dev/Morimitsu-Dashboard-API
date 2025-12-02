import { Router } from 'express'
import { authenticate } from '../middlewares/auth'
import { getPreferencesController } from '../controllers/preferences/get'

const router = Router()

router.get('/', authenticate, getPreferencesController)

export default router
