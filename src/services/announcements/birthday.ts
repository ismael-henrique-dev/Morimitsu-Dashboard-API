import { prisma } from "../../lib";

export class GetBirthdayAnnouncementsService {
  async execute() {
    const today = new Date();
    const day = today.getUTCDate();
    const month = today.getUTCMonth() + 1; // 1-12

    const students = await prisma.students.findMany({
      include: {
        personal_info: true
      }
    });

    return students
      .filter(s => {
        const birth = s.personal_info?.date_of_birth;
        if (!birth) return false;

        const birthDay = birth.getUTCDate();
        const birthMonth = birth.getUTCMonth() + 1;

        return birthDay === day && birthMonth === month;
      })
      .map(s => ({
        type: "birthday",
        student_id: s.id,
        student_name: s.personal_info!.full_name,
        message: `🎉 ${s.personal_info!.full_name} faz aniversário hoje!`
      }));
  }
}
