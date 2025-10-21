import { classes, Prisma } from '@prisma/client'
import { prisma } from '../lib'

export interface ClassesRepositoryInterface {
  create(data: Prisma.classesUncheckedCreateInput): Promise<classes>
  delete(classId: string): Promise<void>
}

//No prisma
export class PrismaClassesRepository implements ClassesRepositoryInterface {
  async create(data: Prisma.classesUncheckedCreateInput): Promise<classes> {
    return await prisma.classes.create({
      data,
    })
  }

  async delete(classId: string): Promise<void> {
    await prisma.classes.delete({
      where: { id: classId },
    })
  }
}

//Em memória
export class InMemoryClassesRepository implements ClassesRepositoryInterface {
  private list: classes[] = []

  async create(data: Prisma.classesUncheckedCreateInput): Promise<classes> {
    const c: classes = {
      id: crypto.randomUUID(),
      name: data.name,
      min_age: data.min_age || 4,
      max_age: data.max_age || null,
      schedule: data.schedule,
      instructor_id: data.instructor_id,
    }
    this.list.push(c)
    return c
  }

  async delete(classId: string): Promise<void> {
    this.list = this.list.filter((c) => c.id !== classId)
  }
}
