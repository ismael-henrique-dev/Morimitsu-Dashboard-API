import { prisma } from "../../lib";
import { PrismaAttendenceRepository } from "../../repositories/attendence";

interface AttendanceItem {
  studentId: string;
  present: boolean;
}

interface MarkAttendanceInput {
  sessionId: string;
  attendance: AttendanceItem[];
}

export class MarkAttendanceService {
  constructor(
    private repo: PrismaAttendenceRepository = new PrismaAttendenceRepository()
  ) {}

  async execute({ sessionId, attendance }: MarkAttendanceInput) {
    // 1️⃣ Buscar presenças anteriores (para não duplicar frequência)
    const previousAttendance = await prisma.student_attendance.findMany({
      where: { session_id: sessionId },
      select: {
        student_id: true,
        present: true
      }
    });

    const prevMap = new Map(
      previousAttendance.map(a => [a.student_id, a.present])
    );

    // 2️⃣ Upsert das presenças
    await this.repo.markAttendanceForSession(sessionId, attendance);

    // 3️⃣ Atualizar frequência APENAS se mudou de false → true
    await Promise.all(
      attendance.map(async item => {
        if (!item.present) return;

        const wasPresentBefore = prevMap.get(item.studentId) === true;
        if (wasPresentBefore) return;

        await prisma.students.update({
          where: { id: item.studentId },
          data: {
            total_frequency: { increment: 1 },
            current_frequency: { increment: 1 }
          }
        });
      })
    );

    // 4️⃣ Retorno LIMPO pro front (nome + presença)
    const studentIds = attendance.map(a => a.studentId);

return prisma.student_attendance.findMany({
  where: {
    session_id: sessionId,
    student_id: { in: studentIds }
  },
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
    });
  }
}