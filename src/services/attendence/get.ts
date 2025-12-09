import { PrismaAttendenceRepository } from "../../repositories/attendence";

interface GetAttendanceFilters {
  classId?: string;
  instructorId?: string;
  date?: string; // yyyy-mm-dd
}

export class GetAttendanceService {
  constructor(
    public attendanceRepository = new PrismaAttendenceRepository()
  ) {}

  async execute(filters: GetAttendanceFilters) {
    const { classId, instructorId, date } = filters;

    const sessions = await this.attendanceRepository.getSessions({
      classId,
      instructorId,
      date
    });

    return sessions;
  }
}
