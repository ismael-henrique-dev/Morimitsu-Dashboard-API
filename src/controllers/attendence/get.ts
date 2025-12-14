import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth";
import { GetAttendanceService } from "../../services/attendence/get";

export const getAttendanceController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { classId, instructorId, date, currentPage } = req.query;

    const service = new GetAttendanceService();

    const result = await service.execute({
      classId: classId as string,
      instructorId: instructorId as string,
      date: date as string,
      currentPage: currentPage ? Number(currentPage) : 1
    });

    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(400).json({
      message: err.message || "Erro ao buscar frequências"
    });
  }
};
