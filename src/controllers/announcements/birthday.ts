import { Request, Response } from "express";
import { GetBirthdayAnnouncementsService } from "../../services/announcements/birthday";

export async function getBirthdayAnnouncementsController(
  req: Request,
  res: Response
) {
  try {
    const service = new GetBirthdayAnnouncementsService();
    const announcements = await service.execute();

    return res.status(200).json(announcements);
  } catch (err: any) {
    return res.status(400).json({
      message: err.message || "Erro ao buscar avisos de aniversário"
    });
  }
}
