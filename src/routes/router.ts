import authRoutes from './auth'
import classesRoutes from './classes'
import studentsRoutes from './students' 
import usersRoutes from './users'
import attendenceRoutes from './attendence'
import sessionsRoutes from './sessions'
import graduationsRoutes from './graduations'
import preferencesRoutes from './preferences'
import announcementsRoutes from './announcements'

export const routes = {
  auth: authRoutes,
  class: classesRoutes,
  student: studentsRoutes,
  user: usersRoutes,
  attendence: attendenceRoutes,
  sessions: sessionsRoutes,
  graduations: graduationsRoutes,
  preferences: preferencesRoutes,
  announcements: announcementsRoutes
}
