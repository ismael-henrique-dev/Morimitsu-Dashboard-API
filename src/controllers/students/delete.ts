import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth";
import { DeleteStudentService } from "../../services/students/delete";
import { PrismaStudentsRepository } from "../../repositories/students";

export const deleteStudentController = async (req: AuthRequest, res: Response) => {
  try {
    const studentId = req.params.id;
    if (!studentId) {
      return res.status(400).json({ message: "ID do aluno é necessário" });
    }

    const service = new DeleteStudentService(new PrismaStudentsRepository());

    await service.handle(studentId);

    return res.status(200).json({ message: "Aluno deletado com sucesso!" });
  } catch (err: any) {
    if (err.code === "P2025") {
      // Prisma error: record not found
      return res.status(404).json({ message: "Aluno não encontrado" });
    }

    console.error("[DELETE_STUDENT_ERROR]", err);
    return res.status(500).json({ message: "Erro interno ao deletar aluno" });
  }
};
