import { Request, Response } from "express";
import { PrismaStudentsRepository } from "../../repositories/students";

export const listEnrolledStudentsController = async (req: Request, res: Response) => {
  try {
    const repo = new PrismaStudentsRepository();
    const result = await repo.listEnrolled();
    return res.json(result);

  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};
