import { Router } from 'express'
import { authenticate } from '../middlewares/auth'
import { getPreferencesController } from '../controllers/preferences/get'
import { updatePreferenceController } from '../controllers/preferences/update'

const router = Router()

router.get('/', authenticate, getPreferencesController)
router.put('/update/:id', authenticate, updatePreferenceController)

export default router
