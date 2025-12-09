import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth";
import { PrismaAttendenceRepository } from "../../repositories/attendence";
import { MarkAttendanceService } from "../../services/attendence/mark";

export const markAttendanceController = async (req: AuthRequest, res: Response) => {
  try {
    const { sessionId, attendance } = req.body;

    if (!sessionId || !attendance || !Array.isArray(attendance)) {
      return res.status(400).json({
        message: "Formato inválido. Envie { sessionId, attendance: [] }"
      });
    }

    const service = new MarkAttendanceService(
      new PrismaAttendenceRepository()
    );

    const result = await service.execute({
      sessionId,
      attendance, // array de alunos
      requesterId: req.user?.userId as string,
      requesterRole: req.user?.role as "admin" | "instructor"
    });

    return res.status(200).json({
      message: "Frequência registrada com sucesso.",
      result
    });

  } catch (err: any) {
    return res.status(400).json({
      message: err.message || "Erro ao registrar frequência."
    });
  }
};
