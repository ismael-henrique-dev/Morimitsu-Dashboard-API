import authRoutes from './auth'
import classesRoutes from './classes'
import studentsRoutes from './students' 
import usersRoutes from './users'

export const routes = {
  auth: authRoutes,
  class: classesRoutes,
  student: studentsRoutes,
  user: usersRoutes
}
