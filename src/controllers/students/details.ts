import { Response } from 'express'
import { AuthRequest } from '../../middlewares/auth'
import { DetailsStudentsService } from '../../services/students/details'
import { PrismaStudentsRepository } from '../../repositories/students'
import { z } from 'zod'

const detailsStudentsSchema = z.object({
  search: z.string().optional(),
})

export const detailsStudentsController = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params 
        const service = new DetailsStudentsService(new PrismaStudentsRepository())
        const student = await service.handle(id)

    if (!student) {
      return res.status(404).json({ message: 'Aluno não encontrado' })
    }   
    return res.status(200).json({
      message: 'Aluno encontrado',
      result: student,
    })
  }catch (err) {   
    console.error(err)
    return res.status(500).json({
      message: 'Erro interno do servidor',
    })
  }
}