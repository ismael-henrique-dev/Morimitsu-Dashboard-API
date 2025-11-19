import { classes, Prisma } from '@prisma/client'
import { prisma } from '../lib'

export interface ClassesRepositoryInterface {
  create(data: Prisma.classesUncheckedCreateInput): Promise<classes>
  delete(classId: string): Promise<void> 
  update(classId: string, data: Partial<Prisma.classesUncheckedUpdateInput>): Promise<classes>
  get(search: string | null): Promise<classes[]>
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

  async get(search: string | null): Promise<classes[]>{
    return prisma.classes.findMany({
      where: search
        ? { name: { 
          contains: search,
          mode: 'insensitive'
        } }
        : {},
        include: {
          instructor: {
            select: {
                username: true,
            }
          },
          _count: {
            select: { students: true },
          }
        }
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
      schedule: data.schedule as any,
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

  async get(search: string | null): Promise<classes[]> {
    if (search) {
      return this.list.filter((c) => 
        c.name.toLowerCase().includes(search.toLowerCase())
      )
    }
    return this.list
  }
}