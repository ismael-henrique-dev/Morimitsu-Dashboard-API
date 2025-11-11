import { Prisma, students } from '@prisma/client'
import { StudentsRepositoryInterface } from '../../repositories/students'

export class UpdateStudentService {
  constructor(private studentsRepository: StudentsRepositoryInterface) {}

  async update(
    studentId: string,
    data: Partial<Prisma.personal_infoUncheckedUpdateInput> // ✅ agora Prisma foi importado
  ): Promise<students> {
    return await this.studentsRepository.update(studentId, data)
  }
}
