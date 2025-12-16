import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth";
import { CreateGraduationService } from "../../services/graduations/create";
import { Belt } from "@prisma/client";
import { z } from "zod"

const createGraduationSchema = z.object({
  belt: z.nativeEnum(Belt).optional(),
  grade: z.number().int().optional(),
  graduation_date: z.coerce.date(),
  studentId: z.string().uuid()

})

export const createGraduationController = async (req: AuthRequest, res: Response) => {
  try {
    const { belt, grade, graduation_date } = req.body;
    const studentId = req.params.id;

    const service = new CreateGraduationService();

    const result = await service.execute({
      studentId,
      belt: belt as Belt,
      grade,
      graduation_date: new Date(graduation_date),
    });

    return res.status(201).json({
      full_name: result.student.personal_info?.full_name ?? null,
      graduation_date: result.graduation_date,
      belt: result.belt,
      grade: result.grade,
    });
  } catch (err: any) {
    console.error("Erro ao criar graduação:", err); // log detalhado do erro
    return res.status(400).json({ message: err.message ?? "Erro interno no servidor" });
  }
};
