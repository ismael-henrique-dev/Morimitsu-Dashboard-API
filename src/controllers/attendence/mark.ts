import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth";
import { PrismaAttendenceRepository } from "../../repositories/attendence";
import { MarkAttendanceService } from "../../services/attendence/mark";

export const markAttendanceController = async (req: AuthRequest, res: Response) => {
  try {
<<<<<<< HEAD
    const { sessionId } = req.params;
    const { students } = req.body as { 
      students: { studentId: string; present: boolean }[] 
    };

    const attendanceRepository = new PrismaAttendenceRepository();
    const service = new MarkAttendanceService(attendanceRepository);


    const result = await service.execute({ sessionId, students });
=======
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
>>>>>>> bb5e1e9bd018decf7e58bea80e80ca7fd0d1a6a3

    return res.status(200).json({
      message: "Frequência registrada com sucesso",
      result
    });

  } catch (err: any) {
<<<<<<< HEAD
    return res.status(400).json({ message: err.message });
=======
    return res.status(400).json({
      message: err.message || "Erro ao registrar frequência."
    });
>>>>>>> bb5e1e9bd018decf7e58bea80e80ca7fd0d1a6a3
  }
};
