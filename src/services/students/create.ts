import { Belt, Prisma } from '@prisma/client'
import { StudentsRepositoryInterface } from '../../repositories/students'

export class EmailConflictError extends Error {
  constructor(email: string) {
    super(`O email já está cadastrado.`)
    this.name = 'EmailConflictError'
  }
}

export class CPFConflictError extends Error {
  constructor(cpf: string) {
    super(`O CPF é invalido.`)
    this.name = 'CPFConflictError'
  }
}

interface CreateStudentRequest {
  cpf: string
  full_name: string
  email: string
  parent_name?: string | null
  parent_phone?: string | null
  student_phone: string
  address: string
  date_of_birth: Date
  grade: number
  belt: Belt
  class_id?: string | null
  ifce_enrollment?: string | null // ✅ opcional
}



export class CreateStudentsService {
  constructor(private studentsRepository: StudentsRepositoryInterface) {}

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

    // 1️⃣ Email único
    const emailExists = await this.studentsRepository.findByEmail(email)
    if (emailExists) {
      throw new EmailConflictError(email)
    }

    // 2️⃣ CPF único
    const cpfExists = await this.studentsRepository.findByCpf(cpf)
    if (cpfExists) {
      throw new CPFConflictError(cpf)
    }

    // 3️⃣ Personal info
    const personalInfoCreate: Prisma.personal_infoCreateWithoutStudentInput = {
      cpf,
      full_name,
      date_of_birth,
      student_phone,
      address,
      parent_name: parent_name ?? null,
      parent_phone: parent_phone ?? null,
    }

    // 4️⃣ Student data
    const studentData: Prisma.studentsCreateInput = {
      email,
      grade,
      belt,
      personal_info: {
        create: personalInfoCreate,
      },
    }

    // 👇 só adiciona se existir
    if (ifce_enrollment != null) {
      studentData.ifce_enrollment = ifce_enrollment
    }

    if (class_id != null) {
      studentData.class = { connect: { id: class_id } }
    }

    return this.studentsRepository.create(studentData)
  }
}
