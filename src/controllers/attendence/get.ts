import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth";
import { PrismaAttendenceRepository } from "../../repositories/attendence";

export const getAttendanceController = async (req: AuthRequest, res: Response) => {
  try {
    const { className, instructorName, date } = req.query;

    const repository = new PrismaAttendenceRepository();

    const sessions = await repository.getSessions({
      className: className as string,
      instructorName: instructorName as string,
      date: date as string
    });

    const formatted = sessions.map((s: any) => ({
      ...s,
      session_date: new Date(s.session_date).toLocaleDateString("pt-BR"), 
    }));
    

    return res.status(200).json(formatted);

  } catch (err: any) {
    return res.status(400).json({
      message: err.message || "Erro ao buscar frequências."
    });
  }
};
