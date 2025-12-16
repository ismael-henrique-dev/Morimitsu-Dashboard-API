import { StudentsRepositoryInterface } from '../../repositories/students'
import { UpdateStudentPayloadFromController } from '../../repositories/students'
import { EmailConflictError } from '../students/errors'

export class UpdateStudentService {
  constructor(private studentsRepo: StudentsRepositoryInterface) {}

  async update(
    studentId: string,
    data: UpdateStudentPayloadFromController
  ) {
    // 🔒 valida email duplicado
    if (data.email) {
      const existing = await this.studentsRepo.findByEmail(data.email)

      if (existing && existing.id !== studentId) {
        throw new EmailConflictError(data.email)
      }
    }

    return this.studentsRepo.update(studentId, data)
  }
}
