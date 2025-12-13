import { prisma } from "../lib";

type UpdateAttendanceParams = {
  student_id: string;
  session_id: string;
  present: boolean;
};

export class PrismaAttendenceRepository {

  async markAttendanceForSession(
    sessionId: string,
    attendance: { studentId: string; present: boolean }[]
  ) {
    return Promise.all(
      attendance.map(a =>
        prisma.student_attendance.upsert({
          where: {
            student_id_session_id: {
              student_id: a.studentId,
              session_id: sessionId
            }
          },
          update: { present: a.present },
          create: {
            session_id: sessionId,
            student_id: a.studentId,
            present: a.present
          }
        })
      )
    );
  }

  async getSessions(filters: any) {
    const { className, instructorName, date } = filters;

    return prisma.class_sessions.findMany({
      where: { 
        class: className
          ? {
              name: { contains: className, mode: "insensitive" }
            }
          : undefined,

        instructor: instructorName
          ? {
              username: { contains: instructorName, mode: "insensitive" }
            }
          : undefined,

        session_date: date ? new Date(date) : undefined
      },

      select: {
        id: true,
        session_date: true,

        class: {
          select: { 
            name: true,
            _count: { select: { students: true } }
          }
        },

        instructor: {
          select: { username: true }
        },
      },

      orderBy: { session_date: "desc" }
    });
  }

  async getAllStudentsByClass(classId: string) {
    return prisma.students.findMany({
      where: { class_id: classId },
      select: {
        id: true,
        personal_info: { select: { full_name: true } }
      },
      orderBy: {
        personal_info: { full_name: "asc" }
      }
    });
  }

  async updateAttendance({
  student_id,
  session_id,
  present
}: UpdateAttendanceParams) {

  return prisma.student_attendance.upsert({
    where: {
      student_id_session_id: {
        student_id,
        session_id
      }
    },
    update: {
      present
    },
    create: {
      student_id,
      session_id,
      present
    },
    include: {
      student: {
        select: {
          personal_info: {
            select: {
              full_name: true
              }
            }
          }
        }
      }
    });
  }
}