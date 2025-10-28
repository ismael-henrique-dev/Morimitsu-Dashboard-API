import { Router } from 'express'
import { createClassController } from '../controllers/classes/create'
import { deleteClassController } from '../controllers/classes/delete'
import { updateClassController } from '../controllers/classes/update'
import { searchClassController } from '../controllers/classes/search'
import { readClassController } from '../controllers/classes/read'
import { authenticate } from '../middlewares/auth'

const router = Router()

router.post('/create', authenticate, createClassController)
router.delete('/delete/:id', authenticate, deleteClassController)
router.patch('/update/:id', authenticate, updateClassController)
router.get('/search/:id', authenticate, searchClassController)
router.get('/read', authenticate, readClassController)

export default router
