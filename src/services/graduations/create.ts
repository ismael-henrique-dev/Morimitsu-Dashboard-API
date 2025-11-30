import { prisma } from "../../lib";
import { PrismaGraduationsRepository } from "../../repositories/graduations";
import { Belt } from "@prisma/client";

interface GraduationInput {
  studentId: string;
  belt: Belt;
  grade: number;
  graduation_date: Date;
}

export class CreateGraduationService {
  constructor(private repository = new PrismaGraduationsRepository()) {}

  async execute(data: GraduationInput) {
    const { studentId, belt, grade, graduation_date } = data;

    // 1. Verificar se o aluno existe
    const student = await prisma.students.findUnique({
      where: { id: studentId }
    });

    if (!student) {
      throw new Error("Aluno não encontrado.");
    }

    // 2. Criar a graduação
    const graduation = await this.repository.createGraduation({
      student: { connect: { id: studentId } },
      belt,
      grade,
      graduation_date,
    });

    // 3. Atualizar faixa e grau do aluno
    await prisma.students.update({
      where: { id: studentId },
      data: { belt, grade }
    });

    return graduation;
  }
}
