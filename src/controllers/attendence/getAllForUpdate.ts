import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth";
import { GetAllForUpdateService } from "../../services/attendence/getAllForUpdate";

export async function getAllForUpdateController(
  req: AuthRequest,
  res: Response
) {
  try {
    const { sessionId } = req.params;

    const service = new GetAllForUpdateService();
    const result = await service.execute(sessionId);

    return res.status(200).json({
      message: "Dados da sessão carregados com sucesso",
      result
    });

  } catch (err: any) {
    return res.status(400).json({
      message: err.message
    });
  }
}
