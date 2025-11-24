import { Response } from 'express'
import { AuthRequest } from '../../middlewares/auth'
import { EnrollStudentService } from '../../services/students/enroll'
import { PrismaStudentsRepository } from '../../repositories/students'
import { PrismaClassesRepository } from '../../repositories/classes'
import { z } from 'zod'

const enrollStudentSchema = z.object({
  studentId: z.string().uuid(),
  classId: z.string().uuid(),
})

export const enrollStudentController = async (req: AuthRequest, res: Response) => {
  try {
    // validação (param + body)
    const { studentId, classId } = enrollStudentSchema.parse(req.body)

    const service = new EnrollStudentService(
      new PrismaStudentsRepository(),
      new PrismaClassesRepository(),
    )

    const result = await service.execute({ studentId, classId })

    return res.status(200).json({
      message: 'Aluno enturmado com sucesso!',
      result,
    })

  } catch (err) {
    // erro de validação do Zod
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Erro de validação',
        errors: err.issues,
      })
    }

    // erros esperados vindos do service (ex: aluno inexistente)
    if (err instanceof Error) {
      return res.status(400).json({
        message: err.message,
      })
    }

    console.error(err)
    return res.status(500).json({
      message: 'Erro interno do servidor',
    })
  }
}
