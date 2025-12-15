import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth";
import { UnenrollStudentService } from "../../services/students/unenroll";
import { PrismaStudentsRepository } from "../../repositories/students";
import { z } from "zod";

const unenrollSchema = z.object({
  studentId: z.string().uuid()
});

export const unenrollStudentController = async (req: AuthRequest, res: Response) => {
  try {
    const { studentId } = unenrollSchema.parse(req.params);

    const service = new UnenrollStudentService(new PrismaStudentsRepository());

    const result = await service.execute({ studentId });

    return res.status(200).json(result);

  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        message: "Erro de validação",
        errors: err.issues
      });
    }

    if (err instanceof Error) {
      return res.status(400).json({
        message: err.message
      });
    }

    console.error(err);
    return res.status(500).json({
      message: "Erro interno do servidor"
    });
  }
};
