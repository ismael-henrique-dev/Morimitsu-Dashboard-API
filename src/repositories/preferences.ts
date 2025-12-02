import { prisma } from '../lib'

export class PrismaPreferencesRepository {
  async findAll() {
    return prisma.graduation_preferences.findMany()
  }
}