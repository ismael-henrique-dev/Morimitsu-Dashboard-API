import { Router } from 'express'
import { authenticate } from '../middlewares/auth'
import { getUsersController } from '../controllers/users/get'
import { promoteStudentController } from '../controllers/users/promote'


const router = Router()

router.get('/', authenticate, getUsersController)
router.post('/promote/:studentId', authenticate, promoteStudentController)

export default router