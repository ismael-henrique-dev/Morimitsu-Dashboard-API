import { classes, Prisma } from '@prisma/client' 
import { ClassesRepositoryInterface } from '../../repositories/classes' 

export class DeleteClassService {
    constructor(private classRepository: ClassesRepositoryInterface) { }

    async handle({ classId }: { classId: string }): Promise<{ id: string }> {
        await this.classRepository.delete(classId)
        return { id: classId }
    }
}
