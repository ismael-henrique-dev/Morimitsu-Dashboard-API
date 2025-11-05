import { Router } from 'express'
import { createStudentController } from '../controllers/students/create'
import { deleteStudentController } from '../controllers/students/delete'
import { getStudentsController } from '../controllers/students/get'
import { authenticate } from '../middlewares/auth'
import { updateStudentsController } from '../controllers/students/update'

const router = Router()

router.post('/create', authenticate, createStudentController)
router.delete('/delete/:id', authenticate, deleteStudentController)
router.get('/', authenticate, getStudentsController)
router.patch('/update/id:', authenticate, updateStudentsController)

export default router
