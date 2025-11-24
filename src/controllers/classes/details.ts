import { Response } from 'express'
import { AuthRequest } from '../../middlewares/auth'
import { DetailsClassesService } from '../../services/classes/details'
import { PrismaClassesRepository } from '../../repositories/classes'
import { string, z } from 'zod'

const detailsClassSchema = z.object({
  search: z.string().optional(),
})

export const detailsClassesController = async (req: AuthRequest, res: Response) => {
  try {
    // valida query (se quiser usar no futuro)
    const query = detailsClassSchema.safeParse(req.query)
    if (!query.success) {
      return res.status(400).json({
        message: 'Parâmetros inválidos',
        issues: query.error.flatten(),
      })
    }

    const { id } = req.params

    if (!string().uuid().safeParse(id).success) {
      return res.status(400).json({ message: 'ID inválido' })
    }

    const service = new DetailsClassesService(new PrismaClassesRepository())
    const classDetails = await service.handle(id)

    if (!classDetails) {
      return res.status(404).json({ message: 'Turma não encontrada' })
    }

    return res.status(200).json({
      message: 'Turma encontrada',
      result: classDetails,
    })

  } catch (err) {
    console.error(err)
    return res.status(500).json({
      message: 'Erro interno do servidor',
    })
  }
}
