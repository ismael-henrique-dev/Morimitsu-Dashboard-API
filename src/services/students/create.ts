import { Belt, students, Prisma } from '@prisma/client'
import { StudentsRepositoryInterface } from '../../repositories/students'

interface CreateStudentRequest {
  cpf: string
  full_name: string
  email: string
  parent_name: string | null | undefined 
  parent_phone: string | null | undefined
  student_phone: string
  address: string
  date_of_birth: Date
  grade: number
  belt: Belt
  class_id?: string | null
  ifce_enrollment?: number | null
}

type CreateStudentRepositoryPayload = Prisma.studentsCreateInput

export class CreateStudentsService {
  constructor(private studentRepository: StudentsRepositoryInterface) {}

  async handle({
    cpf, full_name, email, parent_name, parent_phone, student_phone, address, 
    date_of_birth, grade, belt, class_id, ifce_enrollment,
  }: CreateStudentRequest) {
    
    const personalInfoCreate: any = {
        cpf,
        full_name,
        date_of_birth,
        student_phone,
        address,
    };

    if (parent_name != null) {
        personalInfoCreate.parent_name = parent_name;
    }
    if (parent_phone != null) {
        personalInfoCreate.parent_phone = parent_phone;
    }

    const data: any = {
        email,
        grade,
        belt,
        ifce_enrollment,

        personal_info: {
            create: personalInfoCreate,
        },
    };

    if (class_id != null) {
        // attach the relation by id instead of passing unknown scalar 'class_id'
        data.class = { connect: { id: class_id } };
    }

    const student = await this.studentRepository.create(data)

    return student
  }
}