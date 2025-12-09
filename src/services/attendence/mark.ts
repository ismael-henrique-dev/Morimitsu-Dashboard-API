import { prisma } from "../../lib";
import { PrismaAttendenceRepository } from "../../repositories/attendence";

interface AttendanceItem {
  studentId: string;
  present: boolean;
}

interface MarkAttendanceInput {
  sessionId: string;
  requesterId: string;
  requesterRole: "admin" | "instructor";
  attendance: AttendanceItem[];
}

export class MarkAttendanceService {
  constructor(
    public attendanceRepository = new PrismaAttendenceRepository()
  ) {}

  async execute(data: MarkAttendanceInput) {
    const { sessionId, attendance } = data;

    // 1. Registrar attendance em lote
    const saved = await this.attendanceRepository.markAttendances(
      sessionId,
      attendance
    );

    // 2. Atualizar Frequência de forma individual
    // (isso poderia ser otimizado, mas assim fica claro)
    await Promise.all(
      attendance.map(item => {
        if (item.present) {
          return prisma.students.update({
            where: { id: item.studentId },
            data: {
              total_frequency: { increment: 1 },
              current_frequency: { increment: 1 }
            }
          });
        }
        return null;
      })
    );

    return { message: "Attendance registered", saved };
  }
}
