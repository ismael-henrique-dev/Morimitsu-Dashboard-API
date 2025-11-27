import { classes, Prisma } from '@prisma/client'
import { prisma } from '../lib'

export interface ClassesRepositoryInterface {
  create(data: Prisma.classesUncheckedCreateInput): Promise<classes>
  delete(classId: string): Promise<void>
  update(classId: string, data: Partial<Prisma.classesUncheckedUpdateInput>): Promise<classes>
  get(search: string | null): Promise<classes[]>
  details(classId: string): Promise<classes | null>
}

export class PrismaClassesRepository implements ClassesRepositoryInterface {
  async create(data: Prisma.classesUncheckedCreateInput): Promise<classes> {
    return prisma.classes.create({ data })
  }

  async delete(classId: string): Promise<void> {
    await prisma.classes.delete({
      where: { id: classId },
    })
  }

  async update(classId: string, data: Partial<Prisma.classesUncheckedUpdateInput>): Promise<classes> {
    return prisma.classes.update({
      where: { id: classId },
      data,
    })
  }

  async get(search: string | null): Promise<classes[]> {
    return prisma.classes.findMany({
      where: search
        ? {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          }
        : {},
      include: {
        instructor: {
          select: { username: true },
        },
        _count: {
          select: { students: true },
        },
      },
    })
  }

  async details(classId: string): Promise<classes | null> {
    return prisma.classes.findUnique({
      where: { id: classId },
      include: {
        instructor: {
          select: { username: true },
        },
        students: {
          select: {
            id: true,
          },
        },
        _count: {
          select: { students: true },
        },
      },
    })
  }
}
