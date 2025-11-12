import { students, Prisma } from '@prisma/client'
import { StudentsRepositoryInterface } from '../../repositories/students'

export class UpdateStudentService {
  constructor(private studentsRepository: StudentsRepositoryInterface) {}

async update(studentId: string, data: Partial<Prisma.studentsUpdateInput>) {
    return await this.studentsRepository.update(studentId, data)
  }
}