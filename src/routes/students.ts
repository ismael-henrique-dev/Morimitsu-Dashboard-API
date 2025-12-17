import { Router } from 'express'
import { createStudentController } from '../controllers/students/create'
import { deleteStudentController } from '../controllers/students/delete'
import { getStudentsController } from '../controllers/students/get'
import { updateStudentsController } from '../controllers/students/update'
import { detailsStudentsController } from '../controllers/students/details'
import { authenticate } from '../middlewares/auth'
import { enrollStudentController } from '../controllers/students/enroll'
import { listEnrolledStudentsController } from '../controllers/students/listEnrolled'
import { unenrollStudentController } from '../controllers/students/unenroll'
import { listNotEnrolledStudentsController } from '../controllers/students/notEnrolled'
import { promoteStudentController } from '../controllers/students/promote'

const router = Router()

router.post('/create', authenticate, createStudentController)
router.delete('/delete/:id', authenticate, deleteStudentController)
router.get('/', authenticate, getStudentsController)
router.patch('/update/:id', authenticate, updateStudentsController)
router.get('/:id', authenticate, detailsStudentsController)
router.post('/enroll/:class_id', authenticate, enrollStudentController)
router.get('/enrolled/:classId', authenticate, listEnrolledStudentsController);
router.delete("/unenroll/:studentId", authenticate, unenrollStudentController);
router.get("/not-enrolled/:classId", authenticate, listNotEnrolledStudentsController)
router.post('/promote/:studentId', authenticate,promoteStudentController)

export default router
