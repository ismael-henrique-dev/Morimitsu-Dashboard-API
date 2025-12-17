import { Router } from 'express'
import { authenticate } from '../middlewares/auth'
import { getUsersController } from '../controllers/users/get'
import { updateUserController } from '../controllers/users/update'
import { sendRecoveryController, resetPasswordController } from '../controllers/users/passwordController'


const router = Router()

router.get('/', authenticate, getUsersController)
router.patch('/update/:id', authenticate, updateUserController)
router.post('/forgot-password', sendRecoveryController)
router.post('/reset-password', resetPasswordController)

export default router