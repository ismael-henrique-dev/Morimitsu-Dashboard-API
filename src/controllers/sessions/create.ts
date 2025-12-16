import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth";
import { PrismaSessionsRepository} from "../../repositories/sessions"
import { CreateSessionsService } from "../../services/sessions/create";
import z from "zod";

const createSessionSchema = z.object({
  class_id: z.string().uuid(),
  session_date: z.string().refine(date => !isNaN(Date.parse(date))),
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
    const instructorId = req.user?.userId;

    if (!instructorId) {
      return res.status(401).json({ message: "Token necessário" });
    }

    const service = new CreateSessionsService(
      new PrismaSessionsRepository()
    );

    const session = await service.handle({
      instructorId,
      class_id: body.class_id,
      session_date: new Date(body.session_date),
    });

    return res.status(201).json({
      message: "Sessão criada com sucesso!",
      result: {
        ...session,
        session_date: formatSessionDate(session.session_date),
      },
    });

  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        message: err.issues[0]?.message,
      });
    }

    return res.status(500).json({
      message: "Erro interno do servidor",
    });
  }
};
