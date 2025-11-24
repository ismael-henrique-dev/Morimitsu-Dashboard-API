import { classes } from '@prisma/client'
import { ClassesRepositoryInterface } from '../../repositories/classes'

export class DetailsClassesService {
  constructor(private repo: ClassesRepositoryInterface) {}

  async handle(id: string): Promise<classes | null> {
    return this.repo.details(id)
  }
}
