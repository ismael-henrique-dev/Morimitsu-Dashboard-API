import { prisma } from "../lib"

export interface UsersRepository {
  findInstructors(): Promise<any[]>
}

export class PrismaUsersRepository implements UsersRepository {
  async findInstructors() {
    return prisma.users.findMany({
      where: {
        role: {
          in: ["instructor"],
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
      },
    })
  }
}
