import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth";
import { PrismaAttendenceRepository } from "../../repositories/attendence";

export const getAttendanceController = async (req: AuthRequest, res: Response) => {
  try {
    const { className, instructorName, date } = req.query;

    const repository = new PrismaAttendenceRepository();

    const result = await repository.getSessions({
      className: className as string,
      instructorName: instructorName as string,
      date: date as string
});

    return res.status(200).json(result);

  } catch (err: any) {
    return res.status(400).json({
      message: err.message || "Erro ao buscar frequências."
    });
  }
};
