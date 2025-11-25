import { prisma } from "../lib"

export class AttendanceRepository {
  
  async markAttendance(studentId: string, sessionId: string, present: boolean) {
    return prisma.student_attendance.upsert({
  where: {
    student_id_session_id: {
      student_id: studentId,
      session_id: sessionId
    }
  },
  update: {
    present: true
  },
  create: {
    student_id: studentId,
    session_id: sessionId,
    present: true
  }
  }
    )
  }


  async getAttendanceByStudent(studentId: string) {
    return prisma.student_attendance.findMany({
      where: { student_id: studentId },
      include: {
        session: {
          select: {
            session_date: true,
            class: {
              select: { name: true }
            }
          }
        }
      }
    })
  }
}
