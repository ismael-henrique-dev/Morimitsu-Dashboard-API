import { Response } from 'express'
import { AuthRequest } from '../../middlewares/auth'
import { GetStudentsService } from '../../services/students/get'
import { PrismaStudentsRepository } from '../../repositories/students'
import { z } from 'zod'

const getStudentsSchema = z.object({
  search: z.string().optional(),
})

export const getStudentsController = async (req: AuthRequest, res: Response) => {
  try {
    const { search } = getStudentsSchema.parse({
      search: typeof req.query.search === 'string' ? req.query.search : undefined,
    })

    const service = new GetStudentsService(new PrismaStudentsRepository())
    const students = search
      ? await service.search(search)
      : await service.findMany()

    if (!students || students.length === 0) {
      return res.status(404).json({ message: 'Nenhum aluno encontrado' })
    }

    // 🔹 Formata os dados retornados
    const formattedStudents = students.map((student) => ({
      id: student.id,
      name: student.personal_info?.full_name,
      email: student.email,
      grade: student.grade,
      belt: student.belt,
      cpf: student.personal_info?.cpf,
      date_of_birth: student.personal_info
        ? new Date(student.personal_info.date_of_birth).toLocaleDateString('pt-BR')
        : null,
      student_phone: student.personal_info?.student_phone,
      parent_phone: student.personal_info?.parent_phone,
      parent_name: student.personal_info?.parent_name,
      address: student.personal_info?.address,
    }))

    return res.status(200).json({
      message: 'Alunos encontrados',
      result: formattedStudents,
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Erro de validação',
        issues: err.issues,
      })
    }

    console.error(err)
    return res.status(500).json({
      message: 'Erro interno do servidor',
    })
  }
}
