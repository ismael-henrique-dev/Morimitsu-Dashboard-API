// services/students/update.ts
import { students, Belt } from '@prisma/client'
import { StudentsRepositoryInterface } from '../../repositories/students'

export type UpdateStudentDTO = {
  grade?: number
  belt?: Belt
  personal_info?: {
    full_name?: string
    parent_name?: string
    parent_phone?: string
    student_phone?: string
    address?: string
  }
}

export class UpdateStudentService {
  constructor(private studentsRepository: StudentsRepositoryInterface) {}

  async update(studentId: string, data: UpdateStudentDTO): Promise<students & { personal_info: any | null }> {
    return await this.studentsRepository.update(studentId, data)
  }
}

