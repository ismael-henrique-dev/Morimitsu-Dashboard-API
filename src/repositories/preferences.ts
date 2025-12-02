import { GraduationCategory } from '@prisma/client'
import { prisma } from '../lib'

export class PrismaPreferencesRepository {
  async findAll() {
    return prisma.graduation_preferences.findMany()
  }

  async updateById(id: string, total_trainings: number) {
    return prisma.graduation_preferences.update({
      where: { id },
      data: { total_trainings },
    })
  }

  async updateByCategory(category: string, total_trainings: number) {
    return prisma.graduation_preferences.updateMany({
      where: { category: category as GraduationCategory },
      data: { total_trainings },
    })
  }

  async findById(id: string) {
    return prisma.graduation_preferences.findUnique({
      where: { id },
    })
  }
}
