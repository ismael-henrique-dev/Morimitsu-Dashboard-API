import { Response } from "express"
import { AuthRequest } from "../../middlewares/auth"
import { MarkAttendanceService } from "../../services/attendance/mark"

export const markAttendanceController = async (req: AuthRequest, res: Response) => {
  try {
    const { studentId, sessionId, present } = req.body

    const service = new MarkAttendanceService()

    const result = await service.execute({
      studentId,
      sessionId,
      present,
      requesterId: req.user!.id,
      requesterRole: req.user!.role
    })

    return res.status(200).json({
      message: "Frequência registrada com sucesso.",
      result
    })

  } catch (err: any) {
    return res.status(400).json({ message: err.message })
  }
}
