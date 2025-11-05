import { Belt, students, Prisma } from '@prisma/client'
import { StudentsRepositoryInterface } from '../../repositories/students'

interface CreateStudentRequest {
  cpf: string
  full_name: string
  email: string
  parent_name: string
  parent_phone: string
  student_phone: string
  address: string
  date_of_birth: Date
  grade: number
  belt: Belt
  class_id?: string | null
  ifce_enrollment?: number | null
}

export class CreateStudentsService {
  constructor(private studentRepository: StudentsRepositoryInterface) {}

  async handle({
    cpf,
    full_name,
    email,
    parent_name,
    parent_phone,
    student_phone,
    address,
    date_of_birth,
    grade,
    belt,
    class_id,
    ifce_enrollment,

  }: CreateStudentRequest) {
    const student = await this.studentRepository.create({
      cpf,
      full_name,
      email,
      parent_name,
      parent_phone,
      student_phone,
      address,
      date_of_birth,
      grade,
      belt,
      class_id,
      ifce_enrollment,
    })

    return student
  }
}
