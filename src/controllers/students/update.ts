import { Response } from 'express'
import { AuthRequest } from '../../middlewares/auth'
import { UpdateStudentService } from '../../services/students/update'
import { PrismaStudentsRepository } from '../../repositories/students'
import { z } from 'zod'
import { Belt } from '@prisma/client'
import { normalizeDate } from '../../utils/normalizeDate'
import { EmailConflictError } from '../../services/students/errors'

const updateStudentSchema = z.object({
  email: z.string().email('Email inválido').optional(),
  id: z.string().uuid({ message: 'ID inválido' }),
  grade: z.number().int('Série inválida').optional(),
  belt: z.nativeEnum(Belt).optional(),
  current_frequency: z.number().int().optional(),
  total_frequency: z.number().int().optional(),
  personal_info: z.object({
    full_name: z.string().min(2, 'Nome inválido').optional(),
    parent_name: z.string().min(2, 'Nome do responsável inválido').optional().nullable(),
    parent_phone: z.string().min(8, 'Telefone do responsável inválido').optional().nullable(),
    student_phone: z.string().min(8, 'Telefone do aluno inválido').optional(),
    address: z.string().min(5, 'Endereço inválido').optional(),
    date_of_birth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida (YYYY-MM-DD)').optional(),
  }).optional(),
})

export const updateStudentsController = async (req: AuthRequest, res: Response) => {
  try {
    const parsedData = updateStudentSchema.parse({ id: req.params.id, ...req.body })
    const service = new UpdateStudentService(new PrismaStudentsRepository())

    const updatePayload: any = { ...parsedData }
    if (parsedData.personal_info?.date_of_birth)
      updatePayload.personal_info.date_of_birth = normalizeDate(parsedData.personal_info.date_of_birth)

    const student = await service.update(parsedData.id, updatePayload)

    return res.status(200).json({
      message: 'Aluno atualizado com sucesso!',
      result: {
        id: student.id,
        email: student.email,
        grade: student.grade,
        belt: student.belt,
        current_frequency: student.current_frequency,
        total_frequency: student.total_frequency,
        personal_info: student.personal_info
          ? {
              full_name: student.personal_info.full_name,
              cpf: student.personal_info.cpf,
              date_of_birth: student.personal_info.date_of_birth
                ? new Date(student.personal_info.date_of_birth).toLocaleDateString('pt-BR')
                : null,
              student_phone: student.personal_info.student_phone,
              parent_phone: student.personal_info.parent_phone,
              parent_name: student.personal_info.parent_name,
              address: student.personal_info.address,
            }
          : null,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ message: error.issues[0]?.message || 'Campo inválido' })
    if (error instanceof EmailConflictError) return res.status(409).json({ message: error.message })
    console.error(error)
    return res.status(500).json({ message: 'Erro interno do servidor' })
  }
}
