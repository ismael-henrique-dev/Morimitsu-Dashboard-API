import { Request, Response } from 'express'
import { GetStudentDetailsService } from '../../services/students/details'

export const getStudentDetailsController = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params
    const service = new GetStudentDetailsService()
    const student = await service.execute(studentId)

    return res.status(200).json({
      message: 'Aluno encontrado',
      result: student
    })
  } catch (err: any) {
    console.error(err)
    return res.status(404).json({ message: err.message || 'Erro ao buscar aluno' })
  }
}
