import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth";
import { GetAllStudentsByClassService } from "../../services/attendence/getAllStudentsByClass"

export async function getAllStudentsByClassController(req: AuthRequest, res: Response) {
  try {
    const classId = req.params.class_id;
    const service = new GetAllStudentsByClassService();
    const result = await service.execute(classId);

    return res.status(200).json({
      message: "Alunos encontrados com sucesso",
      result
    });

  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
}
