import { Response } from 'express'
import { AuthRequest } from '../../middlewares/auth'
import { CreateClassService } from '../../services/classes/create'
import { PrismaClassesRepository } from '../../repositories/classes'
import z from 'zod'

const createClassSchema = z
  .object({
    name: z.string(),
    schedule: z.string(),
    minAge: z.number().min(4, 'A idade mínima deve ser pelo menos 4 anos.'),
    maxAge: z.number().nullable().optional(),
  })
  .refine(
    (data) => data.maxAge == null || data.maxAge > data.minAge,
    {
      message: 'A idade máxima deve ser maior que a idade mínima.',
      path: ['maxAge'],
    }
  )

export const createClassController = async (req: AuthRequest,res: Response) => {
  try {
    const body = createClassSchema.parse(req.body)

    const { name, minAge, maxAge, schedule } = body
    const instructor_id = req.user?.userId

    if (!instructor_id) {
      throw new Error('Token necessário')
    }

    const service = new CreateClassService(new PrismaClassesRepository())

    const _response = await service.handle({
      instructor_id,
      name,
      schedule,
      min_age: minAge,
      max_age: maxAge ?? null,
    })

    return res.status(201).json({
      message: 'Turma criada com sucesso!',
      result: _response,
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      const firstMessage = err.message || 'Erro de validação'

      return res.status(400).json({
        message: firstMessage,
      })
    }

    console.error(err)
    return res.status(500).json({ message: 'Erro interno ao criar turma' })
  }
}
