import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth";
import { MarkAttendanceService } from "../../services/attendence/mark";
import z from "zod";

const schema = z.object({
  attendance: z.array(
    z.object({
      studentId: z.string().uuid(),
      present: z.boolean()
    })
  )
});

export async function markAttendanceController(
  req: AuthRequest,
  res: Response
) {
  try {
    const { class_id } = req.params;
    if (!class_id) {
      return res.status(400).json({ message: "class_id é obrigatório" });
    }

    const instructorId = req.user?.userId;
    if (!instructorId) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }

    const { attendance } = schema.parse(req.body);

    const service = new MarkAttendanceService();
    const result = await service.execute({
      classId: class_id,
      instructorId,
      attendance,
    });

    return res.status(200).json({
      message: "Frequência registrada com sucesso",
      attendance: result
    });

  } catch (err: any) {
    return res.status(400).json({
      message: err.message || "Erro ao marcar presença"
    });
  }
}
