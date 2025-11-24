import { Router } from 'express'
import { authenticate } from '../middlewares/auth'
import { getUsersController } from '../controllers/users/get'


const router = Router()

router.get('/', authenticate, getUsersController)

export default router