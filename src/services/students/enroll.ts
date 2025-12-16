import { StudentsRepositoryInterface } from "../../repositories/students";
import { ClassesRepositoryInterface } from "../../repositories/classes";

interface EnrollStudentServiceParams {
  classId: string;
  studentIds: string[];
}

function calculateAge(date: Date): number {
  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();

  const m = today.getMonth() - date.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < date.getDate())) {
    age--;
  }

  return age;
}

export class EnrollStudentService {
  constructor(
    private studentsRepo: StudentsRepositoryInterface,
    private classesRepo: ClassesRepositoryInterface
  ) {}

  async execute({ classId, studentIds }: EnrollStudentServiceParams) {
    const classData = await this.classesRepo.details(classId);
    if (!classData) {
      throw new Error("Turma não encontrada");
    }

    const result: Array<{
      student_id: string;
      full_name: string | null;
      message: string;
    }> = [];

    for (const studentId of studentIds) {
      const student = await this.studentsRepo.details(studentId);
      if (!student || !student.personal_info) continue;

      if (student.class_id === classId) continue;

      const idadeAluno = calculateAge(
        new Date(student.personal_info.date_of_birth)
      );

      if (
        (classData.min_age !== null && idadeAluno < classData.min_age) ||
        (classData.max_age !== null && idadeAluno > classData.max_age)
      ) {
        continue;
      }

      const enrolled = await this.studentsRepo.enroll(studentId, classId);

      result.push({
        student_id: enrolled.id,
        full_name: enrolled.personal_info?.full_name ?? null,
        message: "Aluno enturmado com sucesso"
      });
    }

    return result;
  }
}
