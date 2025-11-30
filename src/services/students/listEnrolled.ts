import { PrismaStudentsRepository } from "../../repositories/students";

export class ListEnrolledStudentsService {
  constructor(private studentsRepository = new PrismaStudentsRepository()) {}

  async listEnrolled() {
    const students = await this.studentsRepository.listEnrolled();

    return students;
  }
}
