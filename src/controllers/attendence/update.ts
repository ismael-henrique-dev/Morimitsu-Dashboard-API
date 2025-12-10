import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth";
import { UpdateAttendanceService } from "../../services/attendence/update";
import z from "zod";

const updateSchema = z.object({
  session_id: z.string().uuid(),
  attendance: z.array(z.object({
    studentId: z.string().uuid(),
    present: z.boolean()
  }))
});

export async function updateAttendanceController(req: AuthRequest, res: Response) {
  try {

    const { session_id, attendance } = updateSchema.parse(req.body);

    const service = new UpdateAttendanceService();

    const result = await service.execute({
      session_id,
      attendances: attendance.map(a => ({
        student_id: a.studentId,  // <-- traduz para o formato do prisma
        present: a.present,
      }))
    });

    return res.status(200).json({
      message: "Frequência atualizada com sucesso!",
      result
    });

  } catch (err: any) {
    return res.status(400).json({
      message: err?.message || "Erro ao atualizar frequência"
    });
  }
}
