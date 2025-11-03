import { Response } from 'express'
import { AuthRequest } from '../../middlewares/auth'
import { GetClassesService } from '../../services/classes/get'
import { PrismaClassesRepository } from '../../repositories/classes'
import z from 'zod'

const getClassesSchema = z.object({
  search: z.string().optional(),
})

export const getClassesController = async (req: AuthRequest, res: Response) => {
  try {
    const parsedParams = getClassesSchema.parse({
      search: typeof req.query.search === 'string' ? req.query.search : undefined,
      
    })

    const service = new GetClassesService(new PrismaClassesRepository())

    if (parsedParams.search) {
      const classData = await service.search(parsedParams.search)
      if (!classData) {
        throw new Error ('Nenhuma turma encontrada')
      }
      return res.status(200).json({ message: 'Turma encontrada', result: classData })
    }

    const classList = await service.findMany()
    return res.status(200).json({ message: 'Lista de turmas', result: classList })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Erro de validação', issues: error.issues })
    }
    console.error(error)
    return res.status(500).json({ message: 'Erro interno do servidor' })
  }
}
