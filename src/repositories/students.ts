import { Prisma, students, Belt } from '@prisma/client'
import { prisma } from '../lib'

// Tipo de retorno com a relação incluída
type StudentWithPersonalInfo = students & { personal_info: any | null }

export interface UpdateStudentPayloadFromController {
    grade?: number
    belt?: Belt
    email?: string
    class_id?: string | null
    ifce_enrollment?: string | null

    personal_info?: {
        full_name?: string
        parent_name?: string | null
        parent_phone?: string | null
        student_phone?: string
        address?: string // AQUI o address está aninhado
        date_of_birth?: Date
    }
}

// Tipo para os parâmetros de busca usados em `get` (pode ser null/undefined conforme o uso no repositório)
export type SearchParam = {
    full_name?: string
    belt?: Belt
    grade?: number
    currentPage?: number
} | null

export interface StudentsRepositoryInterface {
    create(data: Prisma.studentsCreateInput): Promise<StudentWithPersonalInfo>
    delete(studentId: string): Promise<void>
    get(params: SearchParam): Promise<StudentWithPersonalInfo[]>
    update(studentId: string, data: UpdateStudentPayloadFromController): Promise<StudentWithPersonalInfo>
    findByEmail(email: string): Promise<StudentWithPersonalInfo | null>
    details(id: string): Promise<StudentWithPersonalInfo | null>
    enroll(studentId: string, classId: string): Promise<StudentWithPersonalInfo>
}

export class PrismaStudentsRepository implements StudentsRepositoryInterface {

  async create(data: Prisma.studentsCreateInput) {
    return prisma.students.create({
      data,
      include: { personal_info: true, class: true },
    })
  }

  async findByEmail(email: string) {
    return prisma.students.findUnique({
      where: { email },
      include: { personal_info: true, class: true },
    })
  }

  async details(id: string) {
    return prisma.students.findUnique({
      where: { id },
      include: { personal_info: true, class: true },
    })
  }

  async delete(studentId: string): Promise<void> {
    await prisma.personal_info.deleteMany({ where: { student_id: studentId } })
    await prisma.graduations.deleteMany({ where: { student_id: studentId } })
    await prisma.announcements.deleteMany({ where: { student_id: studentId } })
    await prisma.student_attendance.deleteMany({ where: { student_id: studentId } })

    await prisma.students.delete({ where: { id: studentId } })
  }

  async get(params: SearchParam & { currentPage?: string }): Promise<StudentWithPersonalInfo[]> {
    if (!params) {
      return prisma.students.findMany({
        include: { personal_info: true, class: true }
      })
    }

    const andFilters: Prisma.studentsWhereInput[] = []

    if (params.belt) {
      andFilters.push({ belt: params.belt })
    }

    if (params.grade) {
      andFilters.push({ grade: params.grade })
    }

    if (params.full_name) {
      andFilters.push({
        personal_info: {
          is: { full_name: { contains: params.full_name, mode: 'insensitive' } }
        }
      })
    }

    const where: Prisma.studentsWhereInput = andFilters.length > 0 ? { AND: andFilters } : {}

    // Aqui vem a paginação
    const page = params.currentPage ? parseInt(params.currentPage, 10) : 1;
    const pageSize = 10;

    return prisma.students.findMany({
      where,
      include: { personal_info: true, class: true },
      skip: (page - 1) * pageSize,
      take: pageSize
    })
}


  async update(studentId: string, data: UpdateStudentPayloadFromController): Promise<StudentWithPersonalInfo> {

  const { personal_info, ...studentData } = data;

  // Declara o tipo CORRETO do Prisma
  let finalUpdateData: Prisma.studentsUpdateInput = {};

  // 1. Campos raiz do aluno
  for (const key in studentData) {
    const value = (studentData as any)[key];
    if (value === undefined) continue;

    if (value === null) {
      (finalUpdateData as any)[key] = { set: null };
    } else {
      (finalUpdateData as any)[key] = value;
    }
  }

  // 2. Atualização de personal_info
  if (personal_info) {
    const personalInfoUpdate: Prisma.personal_infoUpdateInput = {};

    for (const key in personal_info) {
      const val = (personal_info as any)[key];
      if (val !== undefined) {
        (personalInfoUpdate as any)[key] = val ?? null;
      }
    }

    if (Object.keys(personalInfoUpdate).length > 0) {
      finalUpdateData.personal_info = { update: personalInfoUpdate };
    }
  }

  // 3. Relacionamento da turma
  const classIdValue = (studentData as any).class_id;
  if (classIdValue !== undefined) {
    finalUpdateData.class = classIdValue
      ? { connect: { id: classIdValue } }
      : { disconnect: true };
  }

  // 4. EXECUÇÃO DO UPDATE
  return await prisma.students.update({
    where: { id: studentId },
    data: finalUpdateData,
    include: { personal_info: true },
  });
}

  async enroll(studentId: string, classId: string) {
    return await prisma.students.update({
    where: { id: studentId },
    data: {
        class: { connect: { id: classId } }
    },
    include: { personal_info: true }
}) as StudentWithPersonalInfo;
  }
}
