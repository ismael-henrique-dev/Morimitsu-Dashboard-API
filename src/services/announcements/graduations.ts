import { prisma } from "../../lib";

interface GraduationEligibleStudent {
  id: string;
  name: string;
  graduationType: "grade" | "belt";
  graduation: {
    currentGraduation: {
      belt: string;
      grade: number;
    };
    newGraduation: {
      belt?: string;
      grade?: number;
    };
  };
}


export class GetGraduationAnnouncementsService {
  async execute(): Promise<GraduationEligibleStudent[]> {
    const rules = await prisma.graduation_preferences.findMany();

    const students = await prisma.students.findMany({
      include: {
        personal_info: true
      }
    });

    const result: GraduationEligibleStudent[] = [];

    for (const student of students) {
      if (!student.personal_info) continue;

      const rule = rules.find(rule =>
        rule.belt === student.belt &&
        rule.total_trainings <= student.total_frequency
      );

      if (!rule) continue;

      // 🔹 regra simples (você pode refinar depois)
      const isBeltGraduation = student.grade >= 4; // exemplo

      result.push({
        id: student.id,
        name: student.personal_info.full_name,
        graduationType: isBeltGraduation ? "belt" : "grade",
        graduation: {
          currentGraduation: {
            belt: student.belt,
            grade: student.grade
          },
          newGraduation: isBeltGraduation
            ? { belt: rule.belt } // próxima faixa (ajuste se tiver campo específico)
            : { grade: student.grade + 1 }
        }
      });
    }

    return result;
  }
}
