import { StudentsRepositoryInterface } from "../../repositories/students";
import { ClassesRepositoryInterface } from "../../repositories/classes";

interface EnrollStudentServiceParams {
  studentId: string;
  classId: string;
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

  async execute({ studentId, classId }: EnrollStudentServiceParams) {
    // 1. Verifica se o aluno existe
    const student = await this.studentsRepo.details(studentId);
    if (!student) {
      throw new Error("Estudante não encontrado");
    }

    if (!student.personal_info) {
      throw new Error("Informações pessoais do aluno estão incompletas");
    }

    // 2. Verifica se a turma existe
    const classData = await this.classesRepo.details(classId);
    if (!classData) {
      throw new Error("Turma não encontrada");
    }

    // 3. Verifica se o aluno já está matriculado
    if (student.class_id === classId) {
      throw new Error("O aluno já está matriculado nesta turma");
    }

    // 4. Calcula idade real do aluno
    const idadeAluno = calculateAge(new Date(student.personal_info.date_of_birth));

    // 5. Valida idade mínima
    if (classData.min_age !== null && idadeAluno < classData.min_age) {
      throw new Error(
        `O aluno é muito novo para esta turma. Idade mínima: ${classData.min_age} anos`
      );
    }

    // 6. Valida idade máxima
    if (classData.max_age !== null && idadeAluno > classData.max_age) {
      throw new Error(
        `O aluno excede a idade máxima permitida nesta turma. Idade máxima: ${classData.max_age} anos`
      );
    }

    // 7. Matricula o aluno
    const enrolledStudent = await this.studentsRepo.enroll(studentId, classId);

    return {
      message: "Aluno matriculado com sucesso",
      student: enrolledStudent,
      class: classData,
    };
  }
}
