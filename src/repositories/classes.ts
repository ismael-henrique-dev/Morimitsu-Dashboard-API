import { classes, Prisma } from '@prisma/client'
import { prisma } from '../lib'

export interface ClassesRepositoryInterface {
  create(data: Prisma.classesUncheckedCreateInput): Promise<classes>
  delete(classId: string): Promise<void>
  update(classId: string, data: Partial<Prisma.classesUncheckedUpdateInput>): Promise<classes>
  search(classId: string) : Promise<classes | null>
  read (): Promise<classes[]>
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
  async update(classId: string, data: Partial<Prisma.classesUncheckedUpdateInput>): Promise<classes> {
    return await prisma.classes.update({
      where: { id: classId },
      data,
    })
  }
  async search(classId: string): Promise<classes | null> {
    return await prisma.classes.findUnique({
      where: { id: classId },
    })
  }
  async read(): Promise<classes[]> {
    return await prisma.classes.findMany()
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

  async update(classId: string, data: Partial<Prisma.classesUncheckedUpdateInput>): Promise<classes> {
    const idx = this.list.findIndex((c) => c.id === classId)
    if (idx === -1) throw new Error('Turma não encontrada')

    const updatedClass = { ...this.list[idx], ...data } as classes
    this.list[idx] = updatedClass
    return updatedClass
  }

  async search(classId: string): Promise<classes | null> {
    const c = this.list.find((c) => c.id === classId)
    return c || null
  }
  async read(): Promise<classes[]> {
    return this.list
  }
}
