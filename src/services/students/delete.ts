import { StudentsRepositoryInterface } from "../../repositories/students";

export class DeleteStudentService {
  constructor(private studentRepository: StudentsRepositoryInterface) {}

  async handle(studentId: string): Promise<void> {
    await this.studentRepository.delete(studentId);
  }
}

