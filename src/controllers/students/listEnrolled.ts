import { Request, Response } from "express";
import { PrismaStudentsRepository } from "../../repositories/students";
import { PrismaClassesRepository } from "../../repositories/classes";
import { ListEnrolledStudentsService } from "../../services/students/listEnrolled";

export const listEnrolledStudentsController = async (
  req: Request,
  res: Response
) => {
  try {
    const { classId } = req.params;
    const search =
      typeof req.query.search === "string" ? req.query.search : undefined;

    if (!classId) {
      return res.status(400).json({
        message: "É preciso informar uma turma"
      });
    }

    const service = new ListEnrolledStudentsService(
      new PrismaStudentsRepository(),
      new PrismaClassesRepository()
    );

    const students = await service.execute(classId, search);

    const simplified = students.map(s => ({
      full_name: s.personal_info?.full_name ?? null
    }));

    return res.json(simplified);

  } catch (err: any) {
    return res.status(400).json({
      message: err.message
    });
  }
};
