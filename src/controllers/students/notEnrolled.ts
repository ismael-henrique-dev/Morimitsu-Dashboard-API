import { Request, Response } from "express"
import { PrismaStudentsRepository } from "../../repositories/students"
import { PrismaClassesRepository } from "../../repositories/classes"
import { ListNotEnrolledStudentsService } from "../../services/students/notEnrolled"

export const listNotEnrolledStudentsController = async (
  req: Request,
  res: Response
) => {
  try {
    const { classId } = req.params;
    const { search } = req.query;

    const service = new ListNotEnrolledStudentsService(
      new PrismaStudentsRepository(),
      new PrismaClassesRepository()
    );

    const students = await service.execute(
      classId,
      typeof search === "string" ? search : undefined
    );

    const simplified = students.map(s => ({
      id: s.id,
      full_name: s.personal_info?.full_name ?? null
    }));

    return res.json(simplified);

  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};
