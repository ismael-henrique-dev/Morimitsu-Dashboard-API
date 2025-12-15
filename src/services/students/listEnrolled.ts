import { StudentsRepositoryInterface } from "../../repositories/students";
import { ClassesRepositoryInterface } from "../../repositories/classes";

export class ListEnrolledStudentsService {
  constructor(
    private studentsRepo: StudentsRepositoryInterface,
    private classesRepo: ClassesRepositoryInterface
  ) {}

  async execute(classId?: string) {
    if (classId) {
      const classData = await this.classesRepo.details(classId);
      if (!classData) {
        throw new Error("Turma não encontrada");
      }
    }

    return this.studentsRepo.listEnrolled(classId);
  }
}
