import { Prisma, students, Belt } from '@prisma/client'
import { prisma } from '../lib'

export interface StudentsRepositoryInterface {
  create(data: {
    cpf: string
    full_name: string
    email: string
    parent_name: string
    parent_phone: string
    student_phone: string
    address: string
    date_of_birth: Date
    grade: number
    belt?: Belt
    class_id?: string | null
    ifce_enrollment?: number | null
  }): Promise<students & { personal_info: any | null }>
  
  delete(studentId: string): Promise<void>
  get(search: string | null): Promise<(students & { personal_info: any | null })[]>
  update(studentId: string, data: any): Promise<students & { personal_info: any | null }>
}

export class PrismaStudentsRepository implements StudentsRepositoryInterface {
  async create(data: {
    cpf: string
    full_name: string
    email: string
    parent_name: string
    parent_phone: string
    student_phone: string
    address: string
    date_of_birth: Date
    grade: number
    belt?: Belt
    class_id?: string | null
    ifce_enrollment?: number | null
  }) {
    const student = await prisma.students.create({
      data: {
        email: data.email,
        grade: data.grade,
        belt: data.belt ?? Belt.white,
        class_id: data.class_id ?? null,
        ifce_enrollment: data.ifce_enrollment ?? null,
        personal_info: {
          create: {
            cpf: data.cpf,
            full_name: data.full_name,
            parent_name: data.parent_name,
            parent_phone: data.parent_phone,
            student_phone: data.student_phone,
            address: data.address,
            date_of_birth: data.date_of_birth,
          },
        },
      },
      include: { personal_info: true },
    })

    return student
  }

  async delete(studentId: string): Promise<void> {
    // Apaga dependências primeiro
    await prisma.personal_info.deleteMany({ where: { student_id: studentId } })
    await prisma.graduations.deleteMany({ where: { student_id: studentId } })
    await prisma.announcements.deleteMany({ where: { student_id: studentId } })
    await prisma.student_attendance.deleteMany({ where: { student_id: studentId } })

    // Deleta o aluno
    await prisma.students.delete({ where: { id: studentId } })
  }

  async get(search: string | null): Promise<(students & { personal_info: any | null })[]> {
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
  async update(studentId: string, data: Partial<Prisma.studentsUpdateInput>) {
  const student = await prisma.students.findUnique({
    where: { id: studentId },
    include: { personal_info: true },
  })

  if (!student) throw new Error('Aluno não encontrado')
  if (!student.personal_info && data.personal_info)
    throw new Error('Aluno não possui informações pessoais cadastradas')

  return await prisma.students.update({
    where: { id: studentId },
    data: {
      grade: data.grade,
      belt: data.belt,
      email: data.email,
      personal_info: data.personal_info ?? undefined,
    },
    include: { personal_info: true },
  })
}


}
