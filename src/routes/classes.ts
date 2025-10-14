import { Router } from 'express'
import { createClassController } from '../controllers/classes/create'
import { authenticate } from '../middlewares/auth'

const router = Router()

router.post('/create', authenticate, createClassController)

export default router
