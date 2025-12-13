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
    // 1️⃣ session_id vem da URL
    const { session_id } = req.params;

    if (!session_id) {
      return res.status(400).json({
        message: "session_id é obrigatório"
      });
    }

    // 2️⃣ valida body
    const { attendance } = schema.parse(req.body);

    // 3️⃣ executa service
    const service = new MarkAttendanceService();

    const result = await service.execute({
      sessionId: session_id,
      attendance
    });

    // 4️⃣ retorno direto pro front
    return res.status(200).json({
      message: "Frequência registrada com sucesso",
      attendance: result
    });

  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        message: err.issues[0]?.message || "Erro de validação"
      });
    }

    console.error(err);

    return res.status(500).json({
      message: err.message || "Erro ao marcar presença"
    });
  }
}
