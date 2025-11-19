import { students, Prisma } from '@prisma/client'
import { StudentsRepositoryInterface, UpdateStudentData } from '../../repositories/students'

export class UpdateStudentService {
  constructor(private studentsRepository: StudentsRepositoryInterface) {}

  async update(studentId: string, data: UpdateStudentData) {
    return await this.studentsRepository.update(studentId, data)
  }
}
