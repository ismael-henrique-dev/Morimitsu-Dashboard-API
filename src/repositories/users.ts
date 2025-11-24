import { prisma } from "../lib"

export interface UsersRepository {
  findAdminsAndInstructors(): Promise<any[]>
}

export class PrismaUsersRepository implements UsersRepository {
  async findAdminsAndInstructors() {
    return prisma.users.findMany({
      where: {
        role: {
          in: ["admin", "instructor"],
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
