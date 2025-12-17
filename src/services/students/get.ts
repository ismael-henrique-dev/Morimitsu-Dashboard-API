import { Belt, students } from '@prisma/client'
import { StudentsRepositoryInterface, SearchParam } from '../../repositories/students' 

// Define o tipo de retorno completo (para não usar 'any')
type StudentWithPersonalInfo = students & { personal_info: any | null }

export class GetStudentsService {
  constructor(private repo: StudentsRepositoryInterface) {}

  async getStudents(params: SearchParam): Promise<StudentWithPersonalInfo[]> {
    return this.repo.get(params)
  }

  async countStudents(params: SearchParam): Promise<number> {
    return this.repo.count(params)
  }
}
