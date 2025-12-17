import { prisma } from '../../lib'
import { Belt } from '@prisma/client'

export class GetStudentDetailsService {
  async execute(studentId: string) {
    if (!studentId) throw new Error("studentId não fornecido");

    const student = await prisma.students.findUnique({
      where: { id: studentId },  // ⬅️ aqui precisa estar definido
      include: { personal_info: true, class: true }
    });

    if (!student) throw new Error("Aluno não encontrado");

    // Aqui você pode adicionar o canBePromoted
    const promotableBelts: Belt[] = [
      Belt.purple,
      Belt.brown,
      Belt.black,
      Belt.red,
      Belt.red_black
    ];

    const canBePromoted = promotableBelts.includes(student.belt);

    return { ...student, canBePromoted };
  }
}
