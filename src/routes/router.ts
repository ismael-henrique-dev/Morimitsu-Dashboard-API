import authRoutes from './auth'
import classesRoutes from './classes'
import studentsRoutes from './students' 
import usersRoutes from './users'
import attendenceRoutes from './attendence'
import sessionsRoutes from './sessions'
import graduationsRoutes from './graduations'

export const routes = {
  auth: authRoutes,
  class: classesRoutes,
  student: studentsRoutes,
  user: usersRoutes,
  attendence: attendenceRoutes,
  sessions: sessionsRoutes,
  graduations: graduationsRoutes
}
