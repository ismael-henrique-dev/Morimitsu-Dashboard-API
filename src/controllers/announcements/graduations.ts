import { Request, Response } from "express";
import { GetGraduationAnnouncementsService } from "../../services/announcements/graduations";
import { AuthRequest } from "../../middlewares/auth";

export async function getGraduationAnnouncementsController(
  req: AuthRequest,
  res: Response
) {
  try {
    const service = new GetGraduationAnnouncementsService();
    const graduations = await service.execute();

    return res.status(200).json(graduations);
  } catch (err: any) {
    return res.status(400).json({
      message: err.message || "Erro ao buscar graduáveis"
    });
  }
}

