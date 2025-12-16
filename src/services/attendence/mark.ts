import { PrismaSessionsRepository } from "../../repositories/sessions";

interface AttendanceItem {
  studentId: string;
  present: boolean;
}

interface MarkAttendanceInput {
  classId: string;
  instructorId: string;
  attendance: AttendanceItem[];
}

export class MarkAttendanceService {
  private sessionsRepo = new PrismaSessionsRepository();

  async execute({
    classId,
    instructorId,
    attendance
  }: MarkAttendanceInput) {

    // 🔒 DATA NORMALIZADA
    const sessionDate = new Date();
    sessionDate.setHours(0, 0, 0, 0);

    const session = await this.sessionsRepo.getOrCreateSessionByDate(
      classId,
      instructorId,
      sessionDate
    );

    await this.sessionsRepo.upsertAttendance(
      session.id,
      attendance
    );

    return this.sessionsRepo.getAttendanceBySession(
      session.id,
      attendance.map(a => a.studentId)
    );
  }
}
