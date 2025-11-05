import { Router } from 'express'
import { createClassController } from '../controllers/classes/create'
import { deleteClassController } from '../controllers/classes/delete'
import { updateClassController } from '../controllers/classes/update'
import { getClassesController } from '../controllers/classes/get'
import { authenticate } from '../middlewares/auth'

const router = Router()

router.post('/create', authenticate, createClassController)
router.delete('/delete/:id', authenticate, deleteClassController)
router.patch('/update/:id', authenticate, updateClassController)
router.get('/', authenticate, getClassesController)

export default router