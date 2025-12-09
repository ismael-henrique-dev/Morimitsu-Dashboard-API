import { Prisma } from "@prisma/client";
import { PrismaAttendenceRepository } from "../../repositories/attendence";

<<<<<<< HEAD
import { prisma } from "../../lib";

interface MarkAttendanceInput {
  sessionId: string;
  students: {
    studentId: string;
    present: boolean;
  }[];
=======
interface AttendanceItem {
  studentId: string;
  present: boolean;
}

interface MarkAttendanceInput {
  sessionId: string;
  requesterId: string;
  requesterRole: "admin" | "instructor";
  attendance: AttendanceItem[];
>>>>>>> bb5e1e9bd018decf7e58bea80e80ca7fd0d1a6a3
}

export class MarkAttendanceService {
  constructor(
    public attendanceRepository: PrismaAttendenceRepository
  ) {}

<<<<<<< HEAD
  async execute({ sessionId, students }: MarkAttendanceInput) {
    const results = [];

    for (const s of students) {
      const record = await prisma.student_attendance.upsert({
        where: {
          student_id_session_id: {
            student_id: s.studentId,
            session_id: sessionId
          }
        },
        update: { present: s.present },
        create: {
          student_id: s.studentId,
          session_id: sessionId,
          present: s.present
        }
      });

      results.push(record);
    }

    return results;
=======
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
>>>>>>> bb5e1e9bd018decf7e58bea80e80ca7fd0d1a6a3
  }
}
