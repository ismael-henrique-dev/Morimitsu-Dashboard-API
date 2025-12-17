import { Router } from 'express'
import { authenticate } from '../middlewares/auth'
import { getUsersController } from '../controllers/users/get'
import { updateUserController } from '../controllers/users/update'
import { PasswordController } from '../controllers/users/passwordController'

const router = Router()

// Cria a instância do controller
const passwordController = new PasswordController()

router.get('/', authenticate, getUsersController)
router.patch('/update/:id', authenticate, updateUserController)

// Agora usamos os métodos via instância
router.post('/forgot-password', passwordController.sendRecoveryEmail)
router.post('/reset-password', passwordController.resetPassword)

export default router
