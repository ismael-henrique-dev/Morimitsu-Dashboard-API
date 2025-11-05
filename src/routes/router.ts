import authRoutes from './auth'
import classesRoutes from './classes'
import studentsRoutes from './students' 

export const routes = {
  auth: authRoutes,
  class: classesRoutes,
  student: studentsRoutes
}
