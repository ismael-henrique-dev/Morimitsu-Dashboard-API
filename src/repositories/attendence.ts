import { prisma } from "../lib"

interface SessionFilters {
  classId?: string;
  instructorId?: string;
  date?: string; // yyyy-mm-dd
}

export class PrismaAttendenceRepository {
  
  async markAttendances(sessionId: string, attendance: { studentId: string, present: boolean }[]) {
    
    const data = attendance.map(a => ({
      student_id: a.studentId,
      session_id: sessionId,
      present: a.present
    }));

    return prisma.student_attendance.createMany({
      data,
      skipDuplicates: true
    });
  }

  async getSessions(filters: any) {
  const { className, instructorName, date } = filters;

  return prisma.class_sessions.findMany({
    where: {
      class: className
        ? {
            name: {
              contains: className,  // <<<<< AGORA FUNCIONA PARCIAL
              mode: "insensitive"   // <<<<< SEM CASE SENSITIVITY
            },
          }
        : undefined,

      instructor: instructorName
        ? {
            username: {
              contains: instructorName,
              mode: "insensitive"
            },
          }
        : undefined,

      session_date: date ? new Date(date) : undefined,
    },
    include: {
      class: {
        select: { name: true }
      },
      instructor: {
        select: { username: true }
      },
      attendances: {
        include: {
          student: {
            select: {
              id: true,
              current_frequency: true,
              total_frequency: true
            }
          }
        }
      }
    },
    orderBy: { session_date: "desc" }
  });
}
}