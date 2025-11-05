import { Response } from 'express'
import { AuthRequest } from '../../middlewares/auth'
import { DeleteClassService } from '../../services/classes/delete'
import { PrismaClassesRepository } from '../../repositories/classes'
import z from 'zod'

const deleteClassSchema = z.object({
  id: z.string().uuid('ID inválido'),
})

export const deleteClassController = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = deleteClassSchema.parse(req.params)

    const service = new DeleteClassService(new PrismaClassesRepository())

    await service.handle({ classId: id })

    return res.status(200).json({
      message: 'Turma deletada com sucesso!',
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      const firstMessage = err.issues[0]?.message || 'Erro de validação'
      return res.status(400).json({ message: firstMessage })
    }

    console.error(err)
    return res.status(500).json({ message: 'Erro interno ao deletar turma' })
  }
}
