import { Response } from "express"
import { AuthRequest } from "../../middlewares/auth"
import { CreateStudentsService } from "../../services/students/create"
import { PrismaStudentsRepository } from "../../repositories/students"
import { CPFConflictError, EmailConflictError } from "../../services/students/errors"
import { z } from 'zod'
import { Belt } from '@prisma/client'
import { normalizeDate } from '../../utils/normalizeDate'

// Validação de CPF
const isValidCpf = (cpf: string) => {
  cpf = cpf.replace(/[^\d]+/g, '')
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false
  let sum = 0
  for (let i = 0; i < 9; i++) sum += parseInt(cpf.charAt(i)) * (10 - i)
  let rev = 11 - (sum % 11)
  if (rev === 10 || rev === 11) rev = 0
  if (rev !== parseInt(cpf.charAt(9))) return false
  sum = 0
  for (let i = 0; i < 10; i++) sum += parseInt(cpf.charAt(i)) * (11 - i)
  rev = 11 - (sum % 11)
  if (rev === 10 || rev === 11) rev = 0
  return rev === parseInt(cpf.charAt(10))
}

// Validação de telefone
const phoneSchema = z
  .string()
  .min(10, { message: 'Telefone inválido' })
  .max(11, { message: 'Telefone inválido' })
  .refine(val => /^\d+$/.test(val), { message: 'Telefone inválido' })

// Validação de matrícula IFCE
const enrollmentSchema = z
  .string()
  .refine(val => val.length === 14 && /^\d+$/.test(val), {
    message: 'Matrícula IFCE deve ter 14 dígitos'
  })

// Calcula idade
const calculateAge = (dateOfBirth: Date) => {
  const today = new Date()
  let age = today.getFullYear() - dateOfBirth.getFullYear()
  const m = today.getMonth() - dateOfBirth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < dateOfBirth.getDate())) age--
  return age
}

// Schema de validação
export const createStudentSchema = z
  .object({
    cpf: z
      .string()
      .length(11, { message: 'CPF inválido' })
      .refine(isValidCpf, { message: 'CPF inválido' }),
    full_name: z.string().min(2, { message: 'Nome inválido' }),
    email: z.string().email({ message: 'Email inválido' }),
    parent_name: z.string().min(2, { message: 'Nome do responsável inválido' }).optional().nullable(),
    parent_phone: phoneSchema.optional().nullable(),
    student_phone: phoneSchema,
    current_frequency: z.number().int({ message: 'Frequência atual inválida' }).optional(),
    total_frequency: z.number().int({ message: 'Frequência total inválida' }).optional(),
    address: z.string().min(5, { message: 'Endereço inválido' }),
    date_of_birth: z.string(),
    grade: z.number().int({ message: 'Grau inválido' }),
    belt: z
      .nativeEnum(Belt)
      .optional()
      .refine(val => val === undefined || Object.values(Belt).includes(val), { message: 'Faixa inválida' }),
    class_id: z.string().uuid({ message: 'ID de turma inválido' }).optional(),
    ifce_enrollment: enrollmentSchema.optional(),
  })
  .superRefine((data, ctx) => {
    const date = normalizeDate(data.date_of_birth)
    if (isNaN(date.getTime())) {
      ctx.addIssue({
        code: 'custom',
        message: 'Data de nascimento inválida',
        path: ['date_of_birth']
      })
      return
    }

    const age = calculateAge(date)
    if (age < 4) {
      ctx.addIssue({
        code: 'custom',
        message: 'Aluno deve ter pelo menos 4 anos',
        path: ['date_of_birth']
      })
    }

    // Responsável obrigatório para menores de 18
    if (age < 18) {
      if (!data.parent_name) {
        ctx.addIssue({
          code: 'custom',
          message: 'Nome do responsável é obrigatório para menores de 18 anos',
          path: ['parent_name']
        })
      }
      if (!data.parent_phone) {
        ctx.addIssue({
          code: 'custom',
          message: 'Telefone do responsável é obrigatório para menores de 18 anos',
          path: ['parent_phone']
        })
      }
    }
  })

// Controller
export const createStudentController = async (req: AuthRequest, res: Response) => {
  try {
    const body = createStudentSchema.parse(req.body)

    const service = new CreateStudentsService(new PrismaStudentsRepository())

    const student = await service.handle({
      ...body,
      date_of_birth: normalizeDate(body.date_of_birth),
      belt: body.belt ?? Belt.white
    })

    return res.status(201).json({
      message: 'Aluno criado com sucesso!',
      student
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      const messages = err.issues.map(issue => issue.message).join(', ')
      return res.status(400).json({ message: messages })
    }

    if (err instanceof EmailConflictError || err instanceof CPFConflictError) {
      return res.status(409).json({ message: err.message })
    }

    console.error(err)
    return res.status(500).json({ message: 'Erro interno ao criar aluno' })
  }
}
