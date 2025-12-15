import { StudentsRepositoryInterface } from "../../repositories/students"
import { ClassesRepositoryInterface } from "../../repositories/classes"

export class ListNotEnrolledStudentsService {
  constructor(
    private studentsRepo: StudentsRepositoryInterface,
    private classesRepo: ClassesRepositoryInterface
  ) {}

  async execute(classId: string) {
    const classData = await this.classesRepo.details(classId)

    if (!classData) {
      throw new Error("Turma não encontrada")
    }

    return this.studentsRepo.listNotEnrolledEligibleByClass(
      classData.min_age,
      classData.max_age
    )
  }
}
