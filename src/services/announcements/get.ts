import { PrismaAnnouncementsRepository } from "../../repositories/announcements";
import { prisma } from "../../lib";

interface GetGraduationAnnouncementsInput {
  role: string;
  instructorId: string;
}

export class GetGraduationAnnouncementsService {
  async execute({ role, instructorId }: GetGraduationAnnouncementsInput) {

    if (role !== "admin" && role !== "instructor") {
      throw new Error("Permissão inválida.");
    }

    if (role === "admin") {
      return prisma.announcements.findMany({
        where: { type: "graduation" },
        include: {
          student: {
            include: {
              class: true
            }
          }
        }
      });
    }

    // instructor
    return prisma.announcements.findMany({
      where: {
        type: "graduation",
        student: {
          class: {
            instructor_id: instructorId
          }
        }
      },
      include: {
        student: true
      }
    });
  }
}

