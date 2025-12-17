import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth';
import { prisma } from '../../lib';
import { Belt } from '@prisma/client';

export const promoteStudentController = async (req: AuthRequest, res: Response) => {
  try {
    const { studentId } = req.params;

    const student = await prisma.students.findUnique({
      where: { id: studentId },
      include: { personal_info: true }
    });

    if (!student || !student.personal_info) {
      return res.status(404).json({ message: 'Aluno não encontrado ou sem informações pessoais' });
    }

    const promotableBelts = ['purple', 'brown', 'black', 'red', 'red_black'] as const;
    type PromotableBelt = (typeof promotableBelts)[number];

    if (!promotableBelts.includes(student.belt as PromotableBelt)) {
      return res.status(400).json({ message: 'Aluno não possui faixa elegível para promoção' });
    }

    const { full_name, cpf } = student.personal_info;
    const { email } = student;

    const user = await prisma.users.create({
      data: {
        username: full_name,
        password: cpf, // hash recomendado em produção
        email,
        role: 'instructor'
      }
    });

    return res.status(201).json({ message: 'Aluno promovido a instrutor', user });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};
