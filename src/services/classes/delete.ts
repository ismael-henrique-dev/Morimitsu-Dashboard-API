import { ClassesRepositoryInterface } from '../../repositories/classes'
import { prisma } from '../../lib'

export class DeleteClassService {
  constructor(private classRepository: ClassesRepositoryInterface) {}

  async handle({ classId }: { classId: string }): Promise<void> {
    // Remove a relação dos alunos com essa turma
    await prisma.students.updateMany({
      where: { class_id: classId },
      data: { class_id: null },
    })

    // Agora deleta a turma
    await this.classRepository.delete(classId)
  }
}
