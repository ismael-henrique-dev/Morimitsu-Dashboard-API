import { Request, Response } from "express";
import { PrismaStudentsRepository } from "../../repositories/students";

export const listEnrolledStudentsController = async (req: Request, res: Response) => {
  try {
    const { classId } = req.params;

    if (!classId) {
      return res.status(400).json({ message: "É preciso informar uma turma" });
    }

    const repo = new PrismaStudentsRepository();

    const students = await repo.listEnrolled(classId);

    const simplified = students.map(s => ({
      full_name: s.personal_info?.full_name ?? null
    }));

    return res.json(simplified);

  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};
