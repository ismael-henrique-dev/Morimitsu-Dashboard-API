import { Router } from 'express'
import { createClass } from '../controllers/classes/create'
import { authenticate } from '../middlewares/auth'

const router = Router()

router.post('/create', authenticate, createClass)

export default router
