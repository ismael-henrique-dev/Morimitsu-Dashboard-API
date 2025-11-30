import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth";
import { CreateGraduationService } from "../../services/graduations/create";
import { Belt } from "@prisma/client";

export const createGraduationController = async (req: AuthRequest, res: Response) => {
  try {
    const { studentId, belt, grade, graduation_date } = req.body;

    const service = new CreateGraduationService();

    const result = await service.execute({
      studentId,
      belt: belt as Belt,
      grade,
      graduation_date: new Date(graduation_date)
    });

    return res.status(201).json({
      message: "Graduação registrada com sucesso!",
      result,
    });

  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};
