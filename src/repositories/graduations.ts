import { prisma } from "../lib";
import { Prisma } from "@prisma/client";

export class PrismaGraduationsRepository {

  async createGraduation(data: Prisma.graduationsCreateInput) {
    return prisma.graduations.create({
      data,
      include: {
        student: { include: { personal_info: true } }
      }
    });
  }

  async listByStudent(studentId: string) {
    return prisma.graduations.findMany({
      where: { student_id: studentId },
      orderBy: { graduation_date: "desc" }
    });
  }
}
