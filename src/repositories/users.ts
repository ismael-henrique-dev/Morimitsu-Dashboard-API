import { prisma } from "../lib"
import bcrypt from "bcrypt";

export interface UsersRepository {
  findInstructors(): Promise<any[]>
  promoteStudentToInstructor(studentId: string): Promise<any>
}

export class PrismaUsersRepository implements UsersRepository {
  async findInstructors() {
    return prisma.users.findMany({
      where: {
        role: {
          in: ["instructor"],
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
      },
    })
  }
  async promoteStudentToInstructor(studentId: string) {
    // Busca o aluno
    const student = await prisma.students.findUnique({
      where: { id: studentId },
      include: { personal_info: true }
    });

    if (!student) {
      throw new Error("Aluno não encontrado");
    }

    if (!student.personal_info) {
      throw new Error("Aluno não possui informações pessoais");
    }

    // Cria senha temporária
    const tempPassword = "Senha123!"; // ou gerar aleatória
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Cria o usuário instrutor
    const user = await prisma.users.create({
      data: {
        username: student.personal_info.full_name,
        email: student.email,
        password: hashedPassword,
        role: "instructor"
      }
    });

    return user;
  }
}

