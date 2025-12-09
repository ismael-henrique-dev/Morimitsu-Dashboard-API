import { Response } from 'express'
import { AuthRequest } from '../../middlewares/auth'
import z from 'zod'
import { PrismaPreferencesRepository } from '../../repositories/preferences'
import { GetPreferencesService } from '../../services/preferences/get'

export const getPreferencesController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const service = new GetPreferencesService(new PrismaPreferencesRepository())
    const preferences = await service.execute()

    return res.status(200).json({
      message: 'Preferências encontradas',
      preferences,
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
