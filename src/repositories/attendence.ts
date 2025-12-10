import { tr } from "zod/locales";
import { prisma } from "../lib"

type UpdateAttendanceParams = {
  student_id: string;
  classId: string;
  present: boolean;
};

interface SessionFilters {
  class_id?: string;
  instructorId?: string;
  date?: string; // yyyy-mm-dd
}

export class PrismaAttendenceRepository {
  
  async markAttendances(classId: string,attendance: { studentId: string; present: boolean }[]) {

    const session = await prisma.class_sessions.findFirst({
    where: { 
      class_id: classId, 
    },
  });

  if (!session) {
    throw new Error("Nenhuma sessão encontrada para esta turma.");
  }

  return prisma.student_attendance.createMany({
    data: attendance.map(a => ({
      session_id: session.id,
      student_id: a.studentId,   // <-- CORRETO
      present: a.present
    })),
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
              contains: className, 
              mode: "insensitive"     
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

      select: {

        session_date: true,

        class: {
          select: { 
            name: true,

            _count: {
              select: {
                students: true
              }
            }
          }

        },

        instructor: {
          select: { username: true }
        },
      },
      orderBy: { session_date: "desc" }
    });
  }

  async updateAttendance(params: {
  student_id: string;
  session_id: string;
  present: boolean;
}) {
  return prisma.student_attendance.updateMany({
    where: {
      student_id: params.student_id,
      session_id: params.session_id
    },
    data: {
      present: params.present
    }
  });
}

  async getAllStudentsByClass(classId: string) {
    return prisma.students.findMany({
      where: { class_id: classId },
      select: {
        id: true,
        personal_info: {
          select: {
            full_name: true
          }
        }, // se quiser trazer info pessoal
      },
      orderBy: {
        personal_info: {
          full_name: "asc" // opcional, para ordenar pelo nome
        }
      }
    });
  }
}