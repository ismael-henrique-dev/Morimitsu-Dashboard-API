import { Request, Response } from "express";
import { GetGraduationAnnouncementsService } from "../../services/announcements/graduations";
import { AuthRequest } from "../../middlewares/auth";

export async function getGraduationAnnouncementsController(req: AuthRequest, res: Response
) {
  try {
    const service = new GetGraduationAnnouncementsService();
    const announcements = await service.execute();

    return res.status(200).json(announcements);
  } catch (err: any) {
    return res.status(400).json({
      message: err.message || "Erro ao buscar avisos de graduação"
    });
  }
}
