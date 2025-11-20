import { students, Prisma } from '@prisma/client'
import { StudentsRepositoryInterface, UpdateStudentPayloadFromController } from '../../repositories/students' 

export class UpdateStudentService {
    constructor(private studentsRepository: StudentsRepositoryInterface) {}

    // 🚨 Usa o novo tipo aninhado
    async update(studentId: string, data: UpdateStudentPayloadFromController) {
        return await this.studentsRepository.update(studentId, data)
    }
}