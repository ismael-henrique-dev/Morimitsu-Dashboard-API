import { prisma } from "../lib";

interface GetSessionsFilters {
  classId?: string;
  instructorId?: string;
  date?: string; // yyyy-mm-dd
  currentPage?: number;
}

const PER_PAGE = 10;

export class PrismaAttendenceRepository {

   async getAllStudentsByClass(classId: string) {
    return prisma.students.findMany({
      where: {
        class_id: classId
      },
      include: {
        personal_info: true
      }
    });
  }
  
  async getSessions(filters: GetSessionsFilters) {
    const { classId, instructorId, date, currentPage = 1 } = filters;

    let dateFilter = undefined;

    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);

      const end = new Date(date);
      end.setHours(23, 59, 59, 999);

      dateFilter = {
        gte: start,
        lte: end
      };
    }

    const where = {
      ...(classId ? { class_id: classId } : {}),
      ...(instructorId ? { instructor_id: instructorId } : {}),
      ...(dateFilter ? { session_date: dateFilter } : {})
    };

    const [total, sessions] = await prisma.$transaction([
      prisma.class_sessions.count({ where }),
      prisma.class_sessions.findMany({
        where,
        include: {
          class: {
            select: {
              id: true,
              name: true,
              _count: {
                select: {
                  students: true
                }}
            }
          },
          instructor: {
            select: {
              id: true,
              username: true
            }
          },
          attendances: {
            select: {
              present: true,
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
          }
        },
        orderBy: {
          session_date: "desc"
        },
        skip: (currentPage - 1) * PER_PAGE,
        take: PER_PAGE
      })
    ]);

    return {
      data: sessions,
      pagination: {
        total,
        currentPage,
        perPage: PER_PAGE,
        totalPages: Math.ceil(total / PER_PAGE)
      }
    };
  }

  async upsertAttendance(
    sessionId: string,
    attendance: { studentId: string; present: boolean }[]
  ) {
    return Promise.all(
      attendance.map(item =>
        prisma.student_attendance.upsert({
          where: {
            student_id_session_id: {
              student_id: item.studentId,
              session_id: sessionId
            }
          },
          update: { present: item.present },
          create: {
            session_id: sessionId,
            student_id: item.studentId,
            present: item.present
          }
        })
      )
    );
  }
}
