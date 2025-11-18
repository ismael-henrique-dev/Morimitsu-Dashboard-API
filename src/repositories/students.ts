import { Prisma, students, Belt } from '@prisma/client'
import { prisma } from '../lib'

// Tipo de retorno com a relação incluída
type StudentWithPersonalInfo = students & { personal_info: any | null }

// Interface de Update (agora ambos os campos dos pais são string | null)
export interface UpdateStudentData {
  grade?: number
  belt?: Belt
  email?: string
  class_id?: string | null
  ifce_enrollment?: number | null

  cpf?: string
  full_name?: string
  parent_name?: string | null
  parent_phone?: string | null
  student_phone?: string
  address?: string
  date_of_birth?: Date
}

export interface StudentsRepositoryInterface {
  create(data: Prisma.studentsCreateInput): Promise<StudentWithPersonalInfo>
  delete(studentId: string): Promise<void>
  get(search: string | null): Promise<StudentWithPersonalInfo[]>
  update(studentId: string, data: UpdateStudentData): Promise<StudentWithPersonalInfo>
}

export class PrismaStudentsRepository implements StudentsRepositoryInterface {
    
  async create(data: Prisma.studentsCreateInput) {
    const student = await prisma.students.create({
      data,
      include: { personal_info: true },
    })

    return student
  }

  async delete(studentId: string): Promise<void> {
    await prisma.personal_info.deleteMany({ where: { student_id: studentId } })
    await prisma.graduations.deleteMany({ where: { student_id: studentId } })
    await prisma.announcements.deleteMany({ where: { student_id: studentId } })
    await prisma.student_attendance.deleteMany({ where: { student_id: studentId } })

    await prisma.students.delete({ where: { id: studentId } })
  }

  async get(search: string | null): Promise<StudentWithPersonalInfo[]> {
    return prisma.students.findMany({
      where: search
        ? {
            personal_info: {
              full_name: { contains: search, mode: 'insensitive' },
            },
          }
        : {},
      include: { personal_info: true },
    })
  }
  
  async update(studentId: string, data: UpdateStudentData): Promise<StudentWithPersonalInfo> {
    const student = await prisma.students.findUnique({
      where: { id: studentId },
      include: { personal_info: true },
    })

    if (!student) throw new Error('Aluno não encontrado')
    if (!student.personal_info) throw new Error('Aluno não possui informações pessoais cadastradas')

    // 1. SEPARAÇÃO DE DADOS
    const studentUpdateData: Partial<Prisma.studentsUpdateInput> = {}
    const personalInfoUpdateData: Partial<Prisma.personal_infoUpdateInput> = {}

    // Lista de campos que vão para PersonalInfo
    const personalInfoFields: Array<keyof UpdateStudentData> = [
      'cpf', 'full_name', 'parent_name', 'parent_phone', 
      'student_phone', 'address', 'date_of_birth'
    ]

    for (const key in data) {
      const value = data[key as keyof UpdateStudentData]

      if (personalInfoFields.includes(key as keyof UpdateStudentData)) {
        // Coerção para null
        personalInfoUpdateData[key as keyof Prisma.personal_infoUpdateInput] = (value ?? null) as any
      } else {
        studentUpdateData[key as keyof Prisma.studentsUpdateInput] = value as any
      }
    }
    
    // 2. MONTA O PAYLOAD FINAL
    if (Object.keys(personalInfoUpdateData).length > 0) {
      studentUpdateData.personal_info = {
        update: personalInfoUpdateData
      }
    }

    // 3. EXECUTA A ATUALIZAÇÃO PRINCIPAL
    return await prisma.students.update({
      where: { id: studentId },
      data: studentUpdateData,
      include: { personal_info: true },
    })
  }
}