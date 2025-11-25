import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

interface MarkAttendanceInput {
  studentId: string
  sessionId: string
  present: boolean
  requesterId: string
  requesterRole: "admin" | "instructor"
}

export class MarkAttendanceService {
  async execute({ studentId, sessionId, present, requesterRole, requesterId }: MarkAttendanceInput) {
    
    // Instrutor só pode registrar frequência das próprias aulas
    if (requesterRole === "instructor") {
      const session = await prisma.class_sessions.findUnique({
        where: { id: sessionId },
      })

      if (!session) throw new Error("Sessão não encontrada.")

      if (session.instructor_id !== requesterId) {
        throw new Error("Você não pode alterar frequência de aulas que não ministra.")
      }
    }

    // Registrar frequência
    const attendance = await prisma.student_attendance.create({
      data: {
        student_id: studentId,
        session_id: sessionId,
        present,
      }
    })

    return attendance
  }
}
