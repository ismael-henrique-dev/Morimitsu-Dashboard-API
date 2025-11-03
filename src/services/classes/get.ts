import { classes, Prisma} from '@prisma/client'
import { ClassesRepositoryInterface } from '../../repositories/classes'

export class GetClassesService {
  constructor(private repo: ClassesRepositoryInterface) {}


  async search(name: string): Promise<classes[]> {
    const classData = await this.repo.get(name)
    return classData
  }

  
  async findMany(): Promise<classes[]> {
  const classList = await this.repo.get(null)
  return classList
}

}
