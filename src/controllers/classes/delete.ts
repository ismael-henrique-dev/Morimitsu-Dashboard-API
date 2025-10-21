import { Response } from 'express' 
import { AuthRequest } from '../../middlewares/auth' 
import { DeleteClassService } from '../../services/classes/delete'
import { PrismaClassesRepository } from '../../repositories/classes' 
import z from 'zod' 

const deleteClassSchema = z
    .object({ id: z.string().uuid('ID inválido'), })

export const deleteClassController = async( req: AuthRequest, res: Response ) => {
    try {
        const classId = req.params.id
        if (!classId) {
            throw new Error('ID da turma é necessário')
        }
        const service = new DeleteClassService(new PrismaClassesRepository())
        const _response = await service.handle({
            classId,
        })
        return res.status(201).json({
            message: 'Turma deletada com sucesso!',
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
        return res.status(500).json({message: 'Erro interno ao deletar turma'})
    }
}
   