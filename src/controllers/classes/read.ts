import { Response } from 'express' 
import { AuthRequest } from '../../middlewares/auth' 
import { ReadClassService } from '../../services/classes/read'
import { PrismaClassesRepository } from '../../repositories/classes' 
import z from 'zod'

export const readClassController = async( req: AuthRequest, res: Response ) => {
    try {
        const repo = new PrismaClassesRepository()
        const service = new ReadClassService(repo)
        const _response = await service.findMany()
        return res.status(200).json({
            message: 'Turmas listadas com sucesso!',
            data: _response
        })
    } catch (err) {
        if (err instanceof z.ZodError) {
            const firstMessage = err.message || 'Erro de validação'
            return res.status(400).json({
                message: firstMessage,
            })
        }
        console.error(err)
        return res.status(500).json({message: 'Erro interno ao listar turmas'})
    }
}