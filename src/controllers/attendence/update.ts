import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth";
import { UpdateAttendanceService } from "../../services/attendence/update";
import z from "zod";

const schema = z.object({
  session_date: z.string().refine(v => !isNaN(Date.parse(v)), {
    message: "Data inválida"
  }),
  attendance: z.array(
    z.object({
      studentId: z.string().uuid(),
      present: z.boolean()
    })
  )
});

export async function updateAttendanceController(
  req: AuthRequest,
  res: Response
) {
  try {
    const { class_id } = req.params;
    const instructorId = req.user!.userId;

    if (!class_id) {
      return res.status(400).json({ message: "class_id é obrigatório" });
    }

    const { session_date, attendance } = schema.parse(req.body);

    const service = new UpdateAttendanceService();

    const result = await service.execute({
      classId: class_id,
      instructorId,
      sessionDate: new Date(session_date),
      attendances: attendance.map(a => ({
        student_id: a.studentId,
        present: a.present
      }))
    });

    return res.status(200).json({
      message: "Frequência atualizada com sucesso",
      attendance: result
    });

  } catch (err: any) {
    return res.status(400).json({
      message: err.message || "Erro ao atualizar frequência"
    });
  }
}
