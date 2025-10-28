import { Response } from 'express' 
import { AuthRequest } from '../../middlewares/auth' 
import { SearchClassService } from '../../services/classes/search'
import { PrismaClassesRepository } from '../../repositories/classes' 
import z from 'zod'

const searchClassSchema = z.object({
  id: z.string().uuid({ message: 'ID inválido' }),
})

export const searchClassController = async (req: AuthRequest, res: Response) => {
    try {
        const parsedParams = searchClassSchema.parse({
            id: req.params.id,
        })

        const service = new SearchClassService(new PrismaClassesRepository())
        const _response = await service.search(parsedParams.id)
        if (_response === null) {
            return res.status(404).json({ message: 'Turma não encontrada' })
        }
        return res.status(200).json({
            message: "Turma encontrada!",
            result: _response
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: 'Dados inválidos', issues: error.issues })
        }
        return res.status(500).json({ message: 'Erro interno do servidor' })
    }
} 