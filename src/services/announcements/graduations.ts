import { prisma } from "../../lib";

interface GraduationAnnouncement {
  type: "graduation";
  student_id: string;
  student_name: string;
  belt: string;
  grade: number;
  total_frequency: number;
  required_trainings: number;
  message: string;
}

export class GetGraduationAnnouncementsService {
  async execute() {
    const rules = await prisma.graduation_preferences.findMany();

    const students = await prisma.students.findMany({
      include: {
        personal_info: true
      }
    });

    const announcements: GraduationAnnouncement[] = [];

    for (const student of students) {
      const rule = rules.find(rule =>
        rule.belt === student.belt &&
        rule.total_trainings <= student.total_frequency &&
        (
          rule.min_age === null ||
          rule.max_age === null ||
          student.personal_info === null
            ? true
            : (() => {
                const birth = new Date(student.personal_info.date_of_birth);
                const age =
                  new Date().getFullYear() - birth.getFullYear();
                return (
                  (!rule.min_age || age >= rule.min_age) &&
                  (!rule.max_age || age <= rule.max_age)
                );
              })()
        )
      );

      if (!rule || !student.personal_info) continue;

      announcements.push({
        type: "graduation",
        student_id: student.id,
        student_name: student.personal_info.full_name,
        belt: student.belt,
        grade: student.grade,
        total_frequency: student.total_frequency,
        required_trainings: rule.total_trainings,
        message: `${student.personal_info.full_name} está apto para graduação`
      });
    }

    return announcements;
  }
}
