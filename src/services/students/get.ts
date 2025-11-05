import { students } from '@prisma/client'
import { StudentsRepositoryInterface } from '../../repositories/students'

export class GetStudentsService {
  constructor(private repo: StudentsRepositoryInterface) {}

  async search(name: string): Promise<(students & { personal_info: any | null })[]> {
    return this.repo.get(name)
  }

  async findMany(): Promise<(students & { personal_info: any | null })[]> {
    return this.repo.get(null)
  }
}
