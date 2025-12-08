import { Prisma } from "@prisma/client";
import { PrismaAttendenceRepository } from "../../repositories/attendence";

import { prisma } from "../../lib";

interface MarkAttendanceInput {
  sessionId: string;
  students: {
    studentId: string;
    present: boolean;
  }[];
}

export class MarkAttendanceService {
  constructor(
    public attendanceRepository: PrismaAttendenceRepository
  ) {}

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
  }
}
