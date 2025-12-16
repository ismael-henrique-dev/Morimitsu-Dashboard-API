import { prisma } from "../../lib";

export class GetBirthdayAnnouncementsService {
  async execute() {
    const today = new Date();

    const todayDay = today.getUTCDate();
    const todayMonth = today.getUTCMonth(); // 0–11

    const students = await prisma.students.findMany({
      include: {
        personal_info: true
      }
    });

    return students
      .filter(student => {
        const birth = student.personal_info?.date_of_birth;
        if (!birth) return false;

        return (
          birth.getUTCDate() === todayDay &&
          birth.getUTCMonth() === todayMonth
        );
      })
      .map(student => {
        const birth = student.personal_info!.date_of_birth;

        const age =
          today.getUTCFullYear() - birth.getUTCFullYear();

        const birthday = `${String(birth.getUTCDate()).padStart(2, "0")}/${String(
          birth.getUTCMonth() + 1
        ).padStart(2, "0")}`;

        return {
          type: "birthday",
          student_id: student.id,
          student_name: student.personal_info!.full_name,
          age,
          birthday,
          message: `🎉 ${student.personal_info!.full_name} faz aniversário hoje!`
        };
      });
  }
}
