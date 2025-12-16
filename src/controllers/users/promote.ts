import { Request, Response } from "express";
import { PrismaUsersRepository } from "../../repositories/users";

export const promoteStudentController = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;

    const usersRepository = new PrismaUsersRepository();

    // chama o método do repositório
    const user = await usersRepository.promoteStudentToInstructor(studentId);

    return res.json({
      message: "Aluno promovido a instrutor com sucesso!",
      userId: user.id,
      username: user.username,
      email: user.email
    });
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};
