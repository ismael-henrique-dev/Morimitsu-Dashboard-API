import { Response } from 'express'
import { AuthRequest } from '../../middlewares/auth'
import { UpdateClassService } from '../../services/classes/upadate'
import { PrismaClassesRepository } from '../../repositories/classes'
import { z } from 'zod'

const updateClassSchema = z.object({
  id: z.string().uuid("ID inválido"),
  name: z.string().min(2, "Nome inválido").max(100, "Nome inválido").optional(),
  min_age: z.coerce.number().min(4, "Idade mínima inválida").optional(),
  max_age: z.coerce.number().optional(),
  schedule: z.array(z.object({ dayOfWeek: z.string(), time: z.string() })).optional(),
  instructor_id: z.string().uuid().optional(),
}).refine((data) => data.min_age === undefined || data.max_age === undefined || data.max_age > data.min_age,
  { message: 'A idade máxima deve ser maior que a idade mínima.', path: ['max_age'] }
)

export const updateClassController = async (req: AuthRequest, res: Response) => {
  try {
    const parsedBody = updateClassSchema.parse({ id: req.params.id, ...req.body })
    const service = new UpdateClassService(new PrismaClassesRepository())
    const response = await service.update(parsedBody.id, parsedBody)
    return res.status(200).json({ message: "Turma atualizada com sucesso!", result: response })
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ message: error.issues[0]?.message || 'Campo inválido' })
    console.error(error)
    return res.status(500).json({ message: 'Erro interno do servidor' })
  }
}
