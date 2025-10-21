import { Router } from 'express'
import { createClassController } from '../controllers/classes/create'
import { deleteClassController } from '../controllers/classes/delete'
import { authenticate } from '../middlewares/auth'

const router = Router()

router.post('/create', authenticate, createClassController)
router.delete('/delete/:id', authenticate, deleteClassController)


export default router
