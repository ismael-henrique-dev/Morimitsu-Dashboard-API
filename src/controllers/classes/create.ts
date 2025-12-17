import { Response } from 'express'
import { AuthRequest } from '../../middlewares/auth'
import { CreateClassService } from '../../services/classes/create'
import { PrismaClassesRepository } from '../../repositories/classes'
import { z } from 'zod'

const createClassSchema = z.object({
  name: z.string().min(2, "Nome da turma inválido"),
  minAge: z.coerce.number().min(4, "Idade mínima inválida"),
  maxAge: z.coerce.number().optional(),
  schedule: z.array(z.object({ dayOfWeek: z.string(), time: z.string() })),
  instructor_id: z.string().uuid("ID do instrutor inválido"),
})

export const createClassController = async (req: AuthRequest,res: Response) => {
  try {
    const body = createClassSchema.parse(req.body)
    const instructor_id = req.user?.userId
    if (!instructor_id) return res.status(401).json({ message: 'Token necessário' })

    const service = new CreateClassService(new PrismaClassesRepository())
    const response = await service.handle({ ...body, instructor_id })

    return res.status(201).json({ message: 'Turma criada com sucesso!', result: response })
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ message: err.issues[0]?.message || 'Campo inválido' })
    console.error(err)
    return res.status(500).json({ message: 'Erro interno ao criar turma' })
  }
}
