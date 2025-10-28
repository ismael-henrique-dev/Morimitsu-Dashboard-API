import { classes, Prisma } from '@prisma/client'
import { ClassesRepositoryInterface } from '../../repositories/classes'

export class ReadClassService {
    constructor(private repo: ClassesRepositoryInterface) {}
    async findMany(): Promise<classes[]> {
        const classes = await this.repo.read()
        return classes
    }
}