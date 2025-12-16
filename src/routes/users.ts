import { Router } from 'express'
import { authenticate } from '../middlewares/auth'
import { getUsersController } from '../controllers/users/get'
import { promoteStudentController } from '../controllers/users/promote'
import { updateUserController } from '../controllers/users/update'


const router = Router()

router.get('/', authenticate, getUsersController)
router.post('/promote/:studentId', authenticate, promoteStudentController)
router.patch('/update/:id', authenticate, updateUserController)

export default router