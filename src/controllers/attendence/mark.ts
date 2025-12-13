import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth";
import { MarkAttendanceService } from "../../services/attendence/mark";
import z from "zod";

const schema = z.object({
  session_date: z.string(),
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
    const instructorId = req.user!.userId;

    const body = z.object({
      session_date: z.string(),
      attendance: z.array(
        z.object({
          studentId: z.string().uuid(),
          present: z.boolean()
        })
      )
    }).parse(req.body);

    const service = new MarkAttendanceService();

    const result = await service.execute({
      classId: class_id,
      sessionDate: new Date(body.session_date),
      instructorId,
      attendance: body.attendance
    });

    return res.json({
      message: "Frequência registrada com sucesso",
      attendance: result
    });

  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
}
