import { prisma } from "../lib";

interface AttendanceItem {
  studentId: string;
  present: boolean;
}

export class PrismaSessionsRepository {
  async getOrCreateSessionByDate(
    classId: string,
    instructorId: string,
    sessionDate: Date
  ) {
    const session = await prisma.class_sessions.findFirst({
      where: {
        class_id: classId,
        instructor_id: instructorId,
        session_date: sessionDate,
      },
    });

    if (session) return session;

    return prisma.class_sessions.create({
      data: {
        class_id: classId,
        instructor_id: instructorId,
        session_date: sessionDate,
      },
    });
  }

  async upsertAttendance(sessionId: string, attendance: AttendanceItem[]) {
    return Promise.all(
      attendance.map(item =>
        prisma.student_attendance.upsert({
          where: {
            student_id_session_id: {
              student_id: item.studentId,
              session_id: sessionId,
            },
          },
          update: {
            present: item.present,
          },
          create: {
            session_id: sessionId,
            student_id: item.studentId,
            present: item.present,
          },
        })
      )
    );
  }

  async getAttendanceBySession(sessionId: string, studentIds?: string[]) {
    return prisma.student_attendance.findMany({
      where: {
        session_id: sessionId,
        ...(studentIds ? { student_id: { in: studentIds } } : {}),
      },
      select: {
        present: true,
        student: {
          select: {
            personal_info: {
              select: {
                full_name: true,
              },
            },
          },
        },
      },
    });
  }
}
