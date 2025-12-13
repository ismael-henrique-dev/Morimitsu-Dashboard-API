import { prisma } from "../../lib";
import { PrismaAttendenceRepository } from "../../repositories/attendence";

export class MarkAttendanceService {
  private repo = new PrismaAttendenceRepository();

  async execute({
    classId,
    sessionDate,
    instructorId,
    attendance
  }: {
    classId: string;
    sessionDate: Date;
    instructorId: string;
    attendance: { studentId: string; present: boolean }[];
  }) {

    // 1️⃣ Buscar ou criar sessão do dia
    const start = new Date(sessionDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(sessionDate);
    end.setHours(23, 59, 59, 999);

    let session = await prisma.class_sessions.findFirst({
      where: {
        class_id: classId,
        instructor_id: instructorId,
        session_date: { gte: start, lte: end }
      }
    });

    if (!session) {
      session = await prisma.class_sessions.create({
        data: {
          class_id: classId,
          instructor_id: instructorId,
          session_date: sessionDate
        }
      });
    }

    // 2️⃣ Buscar presenças anteriores
    const previousAttendance = await prisma.student_attendance.findMany({
      where: { session_id: session.id },
      select: { student_id: true, present: true }
    });

    const prevMap = new Map(
      previousAttendance.map(a => [a.student_id, a.present])
    );

    // 3️⃣ Upsert das presenças
    await this.repo.markAttendanceForSession(session.id, attendance);

    // 4️⃣ Atualizar frequência (false → true)
    await Promise.all(
      attendance.map(async item => {
        if (!item.present) return;

        if (prevMap.get(item.studentId)) return;

        await prisma.students.update({
          where: { id: item.studentId },
          data: {
            total_frequency: { increment: 1 },
            current_frequency: { increment: 1 }
          }
        });
      })
    );

    // 5️⃣ Retorno LIMPO
    return prisma.student_attendance.findMany({
      where: {
        session_id: session.id,
        student_id: { in: attendance.map(a => a.studentId) }
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
