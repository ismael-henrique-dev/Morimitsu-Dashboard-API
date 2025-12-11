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
    if (!session_id || !attendances || attendances.length === 0) {
      throw new Error("Dados incompletos para atualizar a frequência.");
    }

    const updatedList = [];

    for (const item of attendances) {
      const updated = await this.repository.updateAttendance({
        student_id: item.student_id,
        session_id,
        present: item.present,
      });
      updatedList.push(updated);
    }
    await Promise.all(
  attendances.map(item => {
    if (item.present === false) {
      return prisma.students.update({
        where: { id: item.student_id },
        data: {
          total_frequency: { decrement: 1 },
          current_frequency: { decrement: 1 }
        }
      });
    }
    if (item.present === true) {
      return prisma.students.update({
        where: { id: item.student_id },
        data: {
          total_frequency: { increment: 1 },
          current_frequency: { increment: 1 }
        }
      });
    }
    return null;
      })
    );
  }
}