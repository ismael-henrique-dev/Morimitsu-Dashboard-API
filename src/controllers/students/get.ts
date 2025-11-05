import { Response } from 'express'
import { AuthRequest } from '../../middlewares/auth'
import { GetStudentsService } from '../../services/students/get'
import { PrismaStudentsRepository } from '../../repositories/students'
import { z } from 'zod'

const getStudentsSchema = z.object({
  search: z.string().optional(),
})

export const getStudentsController = async (req: AuthRequest, res: Response) => {
  try {
    const { search } = getStudentsSchema.parse({
      search: typeof req.query.search === 'string' ? req.query.search : undefined,
    })

    const service = new GetStudentsService(new PrismaStudentsRepository())

    const students = search
      ? await service.search(search)
      : await service.findMany()

    if (!students || students.length === 0) {
      return res.status(404).json({ message: 'Nenhum aluno encontrado' })
    }

    const formattedStudents = students.map((student) => ({
      ...student,
      personal_info: student.personal_info
        ? {
            ...student.personal_info,
            date_of_birth: new Date(student.personal_info.date_of_birth).toLocaleDateString('pt-BR'),
          }
        : null,
    }))

    return res.status(200).json({ message: 'Alunos encontrados', result: formattedStudents })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ message: 'Erro de validação', issues: err.issues })
    }
    console.error(err)
    return res.status(500).json({ message: 'Erro interno do servidor' })
  }
}
