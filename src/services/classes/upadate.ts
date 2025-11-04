import { classes, Prisma } from '@prisma/client' 
import { ClassesRepositoryInterface } from '../../repositories/classes'

export class UpdateClassService {
    constructor(private classesRepository: ClassesRepositoryInterface) {}

<<<<<<< HEAD
    async update(classId: string, classData: Partial<Prisma.classesUncheckedUpdateInput>): Promise<classes> {
        return await this.classesRepository.update(classId,classData)
=======
    async update(classId: string, data: Partial<Prisma.classesUncheckedUpdateInput>): Promise<classes> {
        return await this.classesRepository.update(classId, data)
>>>>>>> develop
    }
}

