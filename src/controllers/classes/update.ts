import { Response } from 'express' 
import { AuthRequest } from '../../middlewares/auth' 
import { UpdateClassService } from '../../services/classes/upadate'
import { PrismaClassesRepository } from '../../repositories/classes' 
import z from 'zod'

const updateClassSchema = z.object({
  id: z.string().uuid({ message: 'ID inválido' }),
  name: z.string().min(2, { message: 'Nome muito curto' }).max(100, { message: 'Nome muito longo' }).optional(),
  min_age: z.coerce.number().min(4, 'A idade deve ser no minimo 4 anos.').optional(),
  max_age: z.coerce.number().min(0).optional(),
  schedule: z.array(
        z.object({
          dayOfWeek: z.string(),
          time: z.string()
      })),
  instructor_id: z.string().uuid({ message: 'ID do instrutor inválido' }).optional(),
}).refine(
  (data) =>
    // Só valida se ambas as idades estiverem presentes
    data.min_age === undefined ||
    data.max_age === undefined ||
    data.max_age > data.min_age,
  {
    message: 'A idade máxima deve ser maior que a idade mínima.',
    path: ['max_age'], // indica qual campo deve exibir o erro
  }
)

export const updateClassController = async (req: AuthRequest, res: Response) => {
    try {
        const parsedBody = updateClassSchema.parse({
            id: req.params.id,
            ...req.body
        })

        const service = new UpdateClassService(new PrismaClassesRepository())
        const _response = await service.update(parsedBody.id, parsedBody)
        return res.status(200).json({
            message: "Turma atualizada com sucesso!",
            result: _response
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: 'Dados inválidos', issues: error.issues })
        }
        return res.status(500).json({ message: 'Erro interno do servidor' })
    }
}