import { classes, Prisma } from '@prisma/client'
import { ClassesRepositoryInterface } from '../../repositories/classes'

export class SearchClassService {
    constructor(private classRepository: ClassesRepositoryInterface) {}

    async search(classId: string): Promise<classes | null> {
        return this.classRepository.search(classId)
    }
}
