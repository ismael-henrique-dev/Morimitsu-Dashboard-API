import { PrismaAttendenceRepository } from "../../repositories/attendence";

export class GetAllStudentsByClassService {
  private repo = new PrismaAttendenceRepository();

  async execute(classId: string) {
    if (!classId) {
      throw new Error("class_id é obrigatório.");
    }
    return await this.repo.getAllStudentsByClass(classId);
  }
}
