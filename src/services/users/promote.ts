import { prisma } from "../../lib";
import bcrypt from "bcrypt";

async function promoteStudentToInstructor(studentId: string) {
  // 1️⃣ Busca o aluno
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

  // 2️⃣ Cria senha padrão temporária
  const tempPassword = "Senha123!"; // ou gerar aleatória
  const hashedPassword = await bcrypt.hash(tempPassword, 10);

  // 3️⃣ Cria o usuário como instructor
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
