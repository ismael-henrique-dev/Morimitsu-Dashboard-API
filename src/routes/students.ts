import { Router } from 'express'
import { createStudentController } from '../controllers/students/create'
import { deleteStudentController } from '../controllers/students/delete'
import { getStudentsController } from '../controllers/students/get'
import { updateStudentsController } from '../controllers/students/update'
import { detailsStudentsController } from '../controllers/students/details'
import { authenticate } from '../middlewares/auth'

const router = Router()

router.post('/create', authenticate, createStudentController)
router.delete('/delete/:id', authenticate, deleteStudentController)
router.get('/', authenticate, getStudentsController)
router.patch('/update/:id', authenticate, updateStudentsController)
router.get('/:id', authenticate, detailsStudentsController)

export default router
