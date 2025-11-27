import { Response } from "express"
import { AuthRequest } from "../../middlewares/auth"
import { PrismaAttendenceRepository } from "../../repositories/attendence"
import { MarkAttendanceService } from "../../services/attendence/mark"

export const markAttendanceController = async (req: AuthRequest, res: Response) => {
  try {
    const { studentId, sessionId, present } = req.body

    // Injetando o repository no service
    const attendanceRepository = new PrismaAttendenceRepository()
    const service = new MarkAttendanceService(attendanceRepository)

    const result = await service.execute({
      studentId,
      sessionId,
      present,
      requesterId: req.user?.userId as string,
      requesterRole: req.user?.role as "admin" | "instructor",
    })

    return res.status(200).json({
      message: "Frequência registrada com sucesso.",
      result
    })

  } catch (err: any) {
    return res.status(400).json({ message: err.message })
  }
}