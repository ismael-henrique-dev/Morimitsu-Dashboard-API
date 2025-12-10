import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth";
import { PrismaSessionsRepository} from "../../repositories/sessions"
import { CreateSessionsService } from "../../services/sessions/create";
import z from "zod";

const createSessionSchema = z.object({
    class_id: z.string().uuid(),
    session_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date format",
    }),
    instructorId: z.string().uuid().optional(),
});

function formatSessionDate(date: Date | string): string {
  const d = new Date(date);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${day}-${month}-${year}`;
}

export const createSessionController = async (req: AuthRequest, res: Response) => {
    try {
        const body = createSessionSchema.parse(req.body);
        const { instructorId, class_id, session_date } = body;

        const instructor_id = req.user?.userId;
        if (!instructor_id) {
            throw new Error("Token necessário");
        }
        const service = new CreateSessionsService(new PrismaSessionsRepository());

        const _response = await service.handle({
            instructorId: instructor_id,
            class_id: class_id,
            session_date: new Date(session_date),
        });
        return res.status(201).json({
            message: "Sessão criada com sucesso!",
            result: {
                ..._response,
                session_date: formatSessionDate(_response.session_date),
            },
        });
    } catch (err) {
        if (err instanceof z.ZodError) {
            const firstMessage = err.issues[0]?.message || "Erro de validação";
            return res.status(400).json({
                message: firstMessage,
            });
        }
        return res.status(500).json({
            message: "Erro interno do servidor",
        });
    }
};
