import { Response, Request } from "express";
import { PrismaGraduationsRepository } from "../../repositories/graduations";

function formatDate(date: Date) {
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
}

export const getGraduationsController = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;

    if (!studentId) {
      return res.status(400).json({
        message: "studentId não informado na URL."
      });
    }

    const repository = new PrismaGraduationsRepository();
    const graduations = await repository.getGraduation(studentId);

    const formatted = graduations.map(g => ({
      ...g,
      graduation_date: formatDate(g.graduation_date)
    }));

    return res.status(200).json(formatted);

  } catch (err: any) {
    return res.status(400).json({
      message: err.message || "Erro ao listar graduações."
    });
  }
};
