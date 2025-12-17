import { Prisma, students, Belt } from '@prisma/client'
import { prisma } from '../lib'

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
        address?: string 
        date_of_birth?: Date
    }
}

export interface SearchParam {
  full_name?: string
  belt?: Belt
  grade?: number
  class_id?: string
  skip?: number
  take?: number
}



export interface StudentsRepositoryInterface {
  create(data: Prisma.studentsCreateInput): Promise<StudentWithPersonalInfo>
  findByEmail(email: string): Promise<StudentWithPersonalInfo | null>
  findByCpf(cpf: string): Promise<StudentWithPersonalInfo | null>
  details(id: string): Promise<StudentWithPersonalInfo | null>
  get(params: SearchParam): Promise<StudentWithPersonalInfo[]>
  count(params: SearchParam): Promise<number>
  update(studentId: string, data: UpdateStudentPayloadFromController): Promise<StudentWithPersonalInfo>
  delete(studentId: string): Promise<void>
  enroll(studentId: string, classId: string): Promise<StudentWithPersonalInfo>
  unenroll(studentId: string): Promise<StudentWithPersonalInfo>
  listEnrolled(classId: string, search?: string): Promise<StudentWithPersonalInfo[]>
  listNotEnrolledEligibleByClass(minAge?: number | null, maxAge?: number | null, search?: string): Promise<StudentWithPersonalInfo[]>
}


export class PrismaStudentsRepository implements StudentsRepositoryInterface {

  async create(data: Prisma.studentsCreateInput): Promise<StudentWithPersonalInfo> {
  return prisma.students.create({
    data,
    include: { personal_info: true }
  })
}

  async findByEmail(email: string): Promise<StudentWithPersonalInfo | null> {
  return prisma.students.findUnique({
    where: { email },
    include: { personal_info: true }
  })
}

  async findByCpf(cpf: string): Promise<StudentWithPersonalInfo | null> {
  return prisma.students.findFirst({
    where: {
      personal_info: {
        cpf
      }
    },
    include: { personal_info: true }
  })
}


  private getAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  async details(id: string) {
    // 1️⃣ Busca aluno com personal_info e classe
    const student = await prisma.students.findUnique({
      where: { id },
      include: { personal_info: true, class: true },
    });

    if (!student || !student.personal_info) return null;

    // 2️⃣ Calcula idade
    const age = this.getAge(student.personal_info.date_of_birth);

    // 3️⃣ Define categoria com base na idade
    let category: 'kids' | 'infanto_juvenil' | 'juvenil_adulto';
    if (age < 12) category = 'kids';
    else if (age <= 16) category = 'infanto_juvenil';
    else category = 'juvenil_adulto';

    // 4️⃣ Busca graduation_preferences pela categoria
    const prefs = await prisma.graduation_preferences.findMany({
      where: { category },
    });

    // 5️⃣ Filtra pelo belt (exceto kids que pode pegar qualquer)
    let pref;
    if (category === 'kids') {
      pref = prefs[0]; // pega qualquer preferência disponível
    } else {
      pref = prefs.find(p => p.belt === student.belt);
    }

    return {
      ...student,
      total_trainings: pref?.total_trainings ?? null,
    };
  }

  async delete(studentId: string): Promise<void> {
    await prisma.personal_info.deleteMany({ where: { student_id: studentId } })
    await prisma.graduations.deleteMany({ where: { student_id: studentId } })
    await prisma.announcements.deleteMany({ where: { student_id: studentId } })
    await prisma.student_attendance.deleteMany({ where: { student_id: studentId } })
    
    await prisma.students.delete({ where: { id: studentId } })
  }

  async get(params?: SearchParam): Promise<StudentWithPersonalInfo[]> {
  if (!params) {
    return prisma.students.findMany({
      include: { personal_info: true, class: true }
    });
  }

  const andFilters: Prisma.studentsWhereInput[] = [];

  if (params.belt) andFilters.push({ belt: params.belt });
  if (params.grade) andFilters.push({ grade: params.grade });
  if (params.class_id) andFilters.push({ class_id: params.class_id });
  if (params.full_name) {
    andFilters.push({
      personal_info: { is: { full_name: { contains: params.full_name, mode: 'insensitive' } } }
    });
  }

  const where: Prisma.studentsWhereInput = andFilters.length > 0 ? { AND: andFilters } : {};

  return prisma.students.findMany({
    where,
    include: { personal_info: true, class: true },
    skip: params.skip ?? 0,
    take: params.take ?? 10
  });
}

async count(params?: SearchParam): Promise<number> {
  const andFilters: Prisma.studentsWhereInput[] = [];

  if (params?.belt) andFilters.push({ belt: params.belt });
  if (params?.grade) andFilters.push({ grade: params.grade });
  if (params?.class_id) andFilters.push({ class_id: params.class_id });
  if (params?.full_name) {
    andFilters.push({
      personal_info: { is: { full_name: { contains: params.full_name, mode: 'insensitive' } } }
    });
  }

  const where: Prisma.studentsWhereInput = andFilters.length > 0 ? { AND: andFilters } : {};

  return prisma.students.count({ where });
}


  async update(
  studentId: string,
  data: UpdateStudentPayloadFromController
) {
  const finalData: Prisma.studentsUpdateInput = {}

  // 🔹 Campos simples
  if (data.email !== undefined) finalData.email = data.email
  if (data.grade !== undefined) finalData.grade = data.grade
  if (data.belt !== undefined) finalData.belt = data.belt
  if (data.ifce_enrollment !== undefined)
    finalData.ifce_enrollment = data.ifce_enrollment

  // 🔹 Relacionamento com turma
  if (data.class_id !== undefined) {
    finalData.class =
      data.class_id === null
        ? { disconnect: true }
        : { connect: { id: data.class_id } }
  }

  // 🔹 Personal info
  if (data.personal_info) {
    const pi = data.personal_info

    finalData.personal_info = {
      upsert: {
        update: {
          ...(pi.full_name !== undefined && { full_name: pi.full_name }),
          ...(pi.student_phone !== undefined && { student_phone: pi.student_phone }),
          ...(pi.address !== undefined && { address: pi.address }),
          ...(pi.date_of_birth !== undefined && { date_of_birth: pi.date_of_birth }),
          ...(pi.parent_name !== undefined && { parent_name: pi.parent_name }),
          ...(pi.parent_phone !== undefined && { parent_phone: pi.parent_phone }),
        },
        create: {
          full_name: pi.full_name ?? '',
          student_phone: pi.student_phone ?? '',
          address: pi.address ?? '',
          date_of_birth: pi.date_of_birth ?? new Date(),
          parent_name: pi.parent_name ?? null,
          parent_phone: pi.parent_phone ?? null,
          cpf: '',
        },
      },
    }
  }

  return prisma.students.update({
    where: { id: studentId },
    data: finalData,
    include: { personal_info: true },
  })
}

  async enroll(studentId: string, classId: string) {
    return await prisma.students.update({
    where: { id: studentId },
    data: {
        class: { connect: { id: classId } }
    },
    select: { personal_info: {
      select: { 
        id: true,
        full_name: true}
    } }
}) as StudentWithPersonalInfo;
  }

  async listEnrolled(classId: string, search?: string) {
  return prisma.students.findMany({
    where: {
      class_id: classId,
      ...(search && {
        personal_info: {
          is: {
            full_name: {
              contains: search,
              mode: "insensitive"
            },
          }
        }
      })
    },
    include: {
      personal_info: true
    }
  });
}

async listEnrolledSimple(classId: string, search?: string) {
  const students = await prisma.students.findMany({
    where: {
      class_id: classId,
      personal_info: { isNot: null },
      ...(search && {
        personal_info: {
          is: {
            full_name: {
              contains: search,
              mode: "insensitive"
            }
          }
        }
      })
    },
    include: { personal_info: true }
  });

  return students.map(student => ({
    id: student.id,
    full_name: student.personal_info!.full_name
  }));
}


async unenroll(studentId: string) {
  return prisma.students.update({
    where: { id: studentId },
    data: {
      class: { disconnect: true } 
    },
    include: { personal_info: true }
  });
}

  async listNotEnrolledEligibleByClass(
  minAge?: number | null,
  maxAge?: number | null,
  search?: string
): Promise<StudentWithPersonalInfo[]> {

  const today = new Date();

  return prisma.students.findMany({
    where: {
      class_id: null,
      personal_info: {
        is: {
          ...(search && {
            full_name: {
              contains: search,
              mode: "insensitive"
            }
          }),
          date_of_birth: {
            ...(minAge !== null && minAge !== undefined && {
              lte: new Date(
                today.getFullYear() - minAge,
                today.getMonth(),
                today.getDate()
              )
            }),
            ...(maxAge !== null && maxAge !== undefined && {
              gte: new Date(
                today.getFullYear() - maxAge - 1,
                today.getMonth(),
                today.getDate() + 1
              )
            })
          }
        }
      }
    },
    include: {
      personal_info: true
      }
    });
  }
}