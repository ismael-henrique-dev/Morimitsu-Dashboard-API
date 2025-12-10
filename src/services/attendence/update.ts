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

    return updatedList;
  }
}
