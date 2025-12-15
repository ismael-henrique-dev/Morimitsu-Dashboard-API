import { prisma } from "../lib";

interface FindAnnouncementsParams {
  type: "graduation" | "birthday";
  instructorId?: string;
  date?: string;        // yyyy-mm-dd
  currentPage?: number;
  perPage?: number;
}

export class PrismaAnnouncementsRepository {

  /* ============================
     CREATE
  ============================ */
  async create(data: {
    student_id: string;
    message: string;
    type: "graduation" | "birthday";
    reference_date: Date;
    expires_at: Date;
  }) {
    return prisma.announcements.create({
      data
    });
  }

  /* ============================
     FIND WITH FILTERS + PAGINATION
  ============================ */
  async findMany({
    type,
    instructorId,
    date,
    currentPage = 1,
    perPage = 10
  }: FindAnnouncementsParams) {

    const skip = (currentPage - 1) * perPage;

    const where: any = {
      type,
      ...(date && {
        reference_date: {
          gte: new Date(`${date}T00:00:00.000Z`),
          lte: new Date(`${date}T23:59:59.999Z`)
        }
      }),
      ...(instructorId && {
        student: {
          class: {
            instructor_id: instructorId
          }
        }
      })
    };

    const [data, total] = await Promise.all([
      prisma.announcements.findMany({
        where,
        skip,
        take: perPage,
        orderBy: {
          reference_date: "asc"
        },
        include: {
          student: {
            include: {
              personal_info: {
                select: {
                  full_name: true
                }
              },
              class: {
                select: {
                  name: true
                }
              }
            }
          }
        }
      }),
      prisma.announcements.count({ where })
    ]);

    return {
      data,
      pagination: {
        total,
        currentPage,
        perPage,
        totalPages: Math.ceil(total / perPage)
      }
    };
  }
}
