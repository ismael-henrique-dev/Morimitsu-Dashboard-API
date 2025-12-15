import { StudentsRepositoryInterface } from "../../repositories/students";

interface UnenrollStudentServiceParams {
  studentId: string;
}

export class UnenrollStudentService {
  constructor(private studentsRepo: StudentsRepositoryInterface) {}

  async execute({ studentId }: { studentId: string }) {
    // 1. Verifica se o aluno existe
    const student = await this.studentsRepo.details(studentId);
    if (!student) throw new Error("Aluno não encontrado");

    // 2. Verifica se está enturmado
    if (!student.class_id) throw new Error("O aluno não está enturmado");

    // 3. Remove vínculo com a turma usando o método correto
    const updatedStudent = await this.studentsRepo.unenroll(studentId);

    return {
      message: "Aluno desenturmado com sucesso",
      student: updatedStudent
    };
  }
}
