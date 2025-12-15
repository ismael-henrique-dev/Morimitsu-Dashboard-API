import { PrismaAttendenceRepository } from "../../repositories/attendence";

export class GetAllStudentsByClassService {
  private repo = new PrismaAttendenceRepository();

  async execute(classId: string) {
    if (!classId) {
      throw new Error("class_id é obrigatório.");
    }

    const students = await this.repo.getAllStudentsByClass(classId);

    // 🔹 Normaliza pro mesmo formato da frequência
    return students.map(student => ({
      student_id: student.id,
      full_name: student.personal_info?.full_name ?? "",
    }));
  }
}
