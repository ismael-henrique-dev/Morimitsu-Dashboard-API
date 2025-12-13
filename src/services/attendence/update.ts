import { prisma } from "../../lib";
import { PrismaAttendenceRepository } from "../../repositories/attendence";

type AttendanceItem = {
  student_id: string;
  present: boolean;
};

type UpdateAttendanceParams = {
  classId: string;
  instructorId: string;
  sessionDate: Date;
  attendances: {
    student_id: string;
    present: boolean;
  }[];
};


export class UpdateAttendanceService {
  private repository = new PrismaAttendenceRepository();

  async execute({
    classId,
    sessionDate,
    instructorId,
    attendances
  }: UpdateAttendanceParams) {

    if (!classId || !sessionDate || attendances.length === 0) {
      throw new Error("Dados incompletos.");
    }

    const start = new Date(sessionDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(sessionDate);
    end.setHours(23, 59, 59, 999);

    const session = await prisma.class_sessions.findFirst({
      where: {
        class_id: classId,
        instructor_id: instructorId,
        session_date: {
          gte: start,
          lte: end
        }
      }
    });

    if (!session) {
      throw new Error("Sessão não encontrada para esta data.");
    }

    const currentAttendances = await prisma.student_attendance.findMany({
      where: { session_id: session.id },
      select: {
        student_id: true,
        present: true
      }
    });

    const currentMap = new Map(
      currentAttendances.map(a => [a.student_id, a.present])
    );

    await Promise.all(
      attendances.map(async item => {
        const wasPresent = currentMap.get(item.student_id) ?? false;
        const isPresent = item.present;

        await prisma.student_attendance.upsert({
          where: {
            student_id_session_id: {
              student_id: item.student_id,
              session_id: session.id
            }
          },
          update: { present: isPresent },
          create: {
            session_id: session.id,
            student_id: item.student_id,
            present: isPresent
          }
        });

        if (wasPresent !== isPresent) {
          await prisma.students.update({
            where: { id: item.student_id },
            data: {
              total_frequency: { increment: isPresent ? 1 : -1 },
              current_frequency: { increment: isPresent ? 1 : -1 }
            }
          });
        }
      })
    );

    return prisma.student_attendance.findMany({
      where: {
        session_id: session.id,
        student_id: { in: attendances.map(a => a.student_id) }
      },
      select: {
        present: true,
        student: {
          select: {
            personal_info: {
              select: { full_name: true }
            }
          }
        }
      }
    });
  }
}
