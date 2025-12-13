import { prisma } from "../../lib";
import { PrismaAttendenceRepository } from "../../repositories/attendence";

type AttendanceItem = {
  student_id: string;
  present: boolean;
};

type UpdateAttendanceParams = {
  session_id: string;
  attendances: AttendanceItem[];
};

export class UpdateAttendanceService {
  private repository = new PrismaAttendenceRepository();

  async execute({ session_id, attendances }: UpdateAttendanceParams) {
    if (!session_id || attendances.length === 0) {
      throw new Error("Dados incompletos.");
    }

    // 1️⃣ Buscar presenças atuais
    const currentAttendances = await prisma.student_attendance.findMany({
      where: { session_id },
      select: {
        student_id: true,
        present: true
      }
    });

    const currentMap = new Map(
      currentAttendances.map(a => [a.student_id, a.present])
    );

    // 2️⃣ Atualizar presença + frequência
    await Promise.all(
      attendances.map(async item => {
        const wasPresent = currentMap.get(item.student_id) ?? false;
        const isPresent = item.present;

        // atualiza presença
        await this.repository.updateAttendance({
          student_id: item.student_id,
          session_id,
          present: isPresent
        });

        // frequência só muda se houve mudança
        if (wasPresent !== isPresent) {
          await prisma.students.update({
            where: { id: item.student_id },
            data: {
              total_frequency: {
                increment: isPresent ? 1 : -1
              },
              current_frequency: {
                increment: isPresent ? 1 : -1
              }
            }
          });
        }
      })
    );
  }
}
