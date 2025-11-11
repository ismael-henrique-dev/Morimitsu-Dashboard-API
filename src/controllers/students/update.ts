import { Response } from 'express'
import { AuthRequest } from '../../middlewares/auth'
import { UpdateStudentService } from '../../services/students/update'
import { PrismaStudentsRepository } from '../../repositories/students'
import { z } from 'zod'
import { Belt } from '@prisma/client'

const updateStudentSchema = z.object({
  id: z.string().uuid({ message: 'Id inválido' }), 
  data: z.object({
    full_name: z.string().min(2, 'Nome inválido'),
    email: z.string().email('Email inválido'),
    parent_name: z.string().min(2, 'Nome do responsável inválido'),
    parent_phone: z.string().min(8, 'Telefone do responsável inválido'),
    student_phone: z.string().min(8, 'Telefone do aluno inválido'),
    address: z.string().min(5, 'Endereço inválido'),
    date_of_birth: z.string().transform((v) => new Date(v)),
    grade: z.number().int('A série deve ser um número inteiro'),
    belt: z.nativeEnum(Belt).optional(),
  }),
})

export async function updateStudent(req: AuthRequest, res: Response) {
  try {
    const parsedData = updateStudentSchema.parse(req.body)

    const studentsRepository = new PrismaStudentsRepository()
    const service = new UpdateStudentService(studentsRepository)

    const updatedStudent = await service.update(parsedData.id, parsedData.data)

    return res.status(200).json(updatedStudent)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Dados inválidos', errors: error.issues })
    }
    console.error(error)
    return res.status(500).json({ message: 'Erro ao atualizar o estudante' })
  }
}

