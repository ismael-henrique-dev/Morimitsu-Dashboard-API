import { Response } from 'express' 
import { AuthRequest } from '../../middlewares/auth' 
import { UpdateClassService } from '../../services/classes/upadate'
import { PrismaClassesRepository } from '../../repositories/classes' 
import z from 'zod'

const updateClassSchema = z.object({
  id: z.string().uuid({ message: 'ID inválido' }),
  data: z.object({
    name: z.string().min(2, { message: 'Nome muito curto' }).max(100, { message: 'Nome muito longo' }).optional(),
    min_age: z.number().min(0).optional(),
    max_age: z.number().min(0).optional(),
    schedule: z.string().optional(),
    instructor_id: z.string().uuid({ message: 'ID do instrutor inválido' }).optional(),
  }),
})

export const updateClassController = async (req: AuthRequest, res: Response) => {
    try {
        const parsedBody = updateClassSchema.parse({
            id: req.params.id,
            data: req.body,
        })

        const service = new UpdateClassService(new PrismaClassesRepository())
        const _response = await service.update(parsedBody.id, parsedBody.data)
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