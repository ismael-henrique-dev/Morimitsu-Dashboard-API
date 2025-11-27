import { prisma } from "../../lib";
import { PrismaAttendenceRepository } from "../../repositories/attendence";

interface MarkAttendanceInput {
  studentId: string;
  sessionId: string;
  present: boolean;
  requesterId: string;
  requesterRole: "admin" | "instructor";
}

export class MarkAttendanceService {
  constructor(
    public attendanceRepository = new PrismaAttendenceRepository()
  ) {}

  async execute(data: MarkAttendanceInput) {
    const { studentId, sessionId, present } = data;

    // 1. Registrar frequência na tabela student_attendance
    const attendance = await this.attendanceRepository.markAttendance(
      studentId,
      sessionId,
      present
    );

    // 2. Atualizar frequência do aluno (students table)
    if (present) {
      await prisma.students.update({
        where: { id: studentId },
        data: {
          total_frequency: {
            increment: 1
          },
          current_frequency: {
            increment: 1
          }
        }
      });
    }

    return attendance;
  }
}
