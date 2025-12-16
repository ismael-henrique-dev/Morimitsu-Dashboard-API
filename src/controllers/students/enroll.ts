import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth";
import { EnrollStudentService } from "../../services/students/enroll";
import { PrismaStudentsRepository } from "../../repositories/students";
import { PrismaClassesRepository } from "../../repositories/classes";
import { z } from "zod";

const schema = z.object({
  studentIds: z.array(z.string().uuid())
});

export const enrollStudentController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { class_id } = req.params;

    if (!class_id) {
      return res.status(400).json({ message: "class_id é obrigatório" });
    }

    const { studentIds } = schema.parse(req.body);

    const service = new EnrollStudentService(
      new PrismaStudentsRepository(),
      new PrismaClassesRepository()
    );

    const result = await service.execute({
      classId: class_id,
      studentIds
    });

    return res.status(200).json({
      message: "Alunos enturmados",
      result
    });

  } catch (err: any) {
    return res.status(400).json({
      message: err.message || "Erro ao enturmar alunos"
    });
  }
};
