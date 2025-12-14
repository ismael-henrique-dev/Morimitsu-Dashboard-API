import { PrismaAttendenceRepository } from "../../repositories/attendence";

interface GetAttendanceFilters {
  classId?: string;
  instructorId?: string;
  date?: string;
  currentPage?: number;
}

export class GetAttendanceService {
  constructor(
    private repository = new PrismaAttendenceRepository()
  ) {}

  async execute(filters: GetAttendanceFilters) {
    return this.repository.getSessions(filters);
  }
}
