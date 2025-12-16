import { Response } from 'express'
import { AuthRequest } from '../../middlewares/auth'
import { CreateClassService } from '../../services/classes/create'
import { PrismaClassesRepository } from '../../repositories/classes'
import z from 'zod'

const createClassSchema = z.object({
  name: z.string().min(2),
  minAge: z.coerce.number().min(4),
  maxAge: z.coerce.number(),
  schedule: z.array(
    z.object({
      dayOfWeek: z.string(),
      time: z.string(),
    })
  ),
  instructor_id: z.string().uuid(), 
})


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
       schedule: schedule, // Importe o Prisma para acessar JsonValue
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
