import { prisma } from "../../lib";
import { PrismaAttendenceRepository } from "../../repositories/attendence";

interface AttendanceItem {
  studentId: string;
  present: boolean;
}

interface MarkAttendanceInput {
  classId: string;
  requesterId: string;
  requesterRole: "admin" | "instructor";
  attendance: AttendanceItem[];
}

export class MarkAttendanceService {
  constructor(
    public attendanceRepository = new PrismaAttendenceRepository()
  ) {}

  async execute(data: MarkAttendanceInput) {
    const { classId, attendance } = data;
    // 2. Registrar attendance em lote
    const saved = await this.attendanceRepository.markAttendances(
      classId,
      attendance.map(a => ({
        studentId: a.studentId,
        present: a.present
      }))
    );

    // 3. Atualizar frequência dos alunos presentes
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

    return {message: "Presença aplicada" };
  }
}

