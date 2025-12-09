import { Response } from 'express'
import { AuthRequest } from '../../middlewares/auth'
import z from 'zod'
import { PrismaPreferencesRepository } from '../../repositories/preferences'
import { UpdatePreferenceService } from '../../services/preferences/update'

const bodySchema = z.object({
  totalTrainings: z.number().min(0, 'total_trainings deve ser >= 0'),
})

export const updatePreferenceController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const id = req.params.id
    const { totalTrainings } = bodySchema.parse(req.body)

    const service = new UpdatePreferenceService(
      new PrismaPreferencesRepository()
    )

    const updated = await service.execute(id, totalTrainings)

    return res.status(200).json({
      message: 'Preferência atualizada com sucesso',
      result: updated,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Erro de validação',
        issues: error.issues,
      })
    }

    console.error(error)
    return res.status(500).json({ message: 'Erro interno do servidor' })
  }
}
