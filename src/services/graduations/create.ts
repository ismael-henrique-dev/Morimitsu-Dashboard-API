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

    // 1️⃣ Buscar aluno
    const student = await prisma.students.findUnique({
      where: { id: studentId },
      include: { personal_info: true }
    });

    if (!student) throw new Error("Aluno não encontrado.");
    if (!student.personal_info) throw new Error("Aluno sem informações pessoais.");

    // 2️⃣ Calcular idade
    const today = new Date();
    const birth = new Date(student.personal_info.date_of_birth);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;

    // 3️⃣ Buscar categoria correta
    let category: "kids" | "infanto_juvenil" | "juvenil_adulto";
    if (age < 12) category = "kids";
    else if (age <= 16) category = "infanto_juvenil";
    else category = "juvenil_adulto";

    // 4️⃣ Buscar faixas permitidas para essa categoria
    const allowedBelt = await prisma.graduation_preferences.findFirst({
      where: { category }
    });

    if (!allowedBelt) throw new Error("Não existem faixas definidas para a categoria do aluno.");

    // 5️⃣ Validar se a faixa que o admin quer colocar é permitida
    // (Se for infanto_juvenil, podemos checar se a faixa bate com o que está no cadastro)
    if (category === "juvenil_adulto") {
      // Exemplo: apenas permitir faixas "preta" ou "marrom"
      const adultBelts = ["brown", "black", "red", "coral", "red_black"];
      if (!adultBelts.includes(belt)) {
        throw new Error(`Faixa "${belt}" não permitida.`);
      }
    }

    // 6️⃣ Criar graduação
    const graduation = await this.repository.createGraduation({
      student: { connect: { id: studentId } },
      belt,
      grade,
      graduation_date,
    });

    // 7️⃣ Atualizar faixa e grau do aluno
    await prisma.students.update({
      where: { id: studentId },
      data: { belt, grade }
    });

    return graduation;
  }
}
