import { Response } from "express"
import { AuthRequest } from "../../middlewares/auth"
import { CPFConflictError, CreateStudentsService } from "../../services/students/create"
import { PrismaStudentsRepository } from "../../repositories/students"
import { number, string, z } from "zod"
import { Belt } from "@prisma/client"
import { normalizeDate } from "../../utils/normalizeDate"
import { EmailConflictError } from "../../services/students/create"

// A função calculateAge não é mais usada para validação condicional, mas é mantida por segurança.
const calculateAge = (dateOfBirth: Date): number => {
    const today = new Date()
    let age = today.getFullYear() - dateOfBirth.getFullYear()
    const m = today.getMonth() - dateOfBirth.getMonth()
    
    if (m < 0 || (m === 0 && today.getDate() < dateOfBirth.getDate())) {
        age--
    }
    return age
}

const enrollmentSchema = z
  .union([
    z.string(), // Aceita string na entrada
  ])
  .pipe(
    z.string() // Força a validação como String
      .transform(val => String(val)) // Converte qualquer entrada (number ou string) para String
      .refine(val => val.length === 14 && /^\d+$/.test(val), {
        message: "Matrícula IFCE deve ter 14 dígitos."
      })
  );

  const IsValidCpf = (cpf: string): boolean => {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(cpf.charAt(i)) * (10 - i);
    let rev = 11 - (sum % 11);
    if (rev === 10 || rev === 11) rev = 0;
    if (rev !== parseInt(cpf.charAt(9))) return false;
    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (sum % 11);
    if (rev === 10 || rev === 11) rev = 0;
    if (rev !== parseInt(cpf.charAt(10))) return false;
    return true;
}

  const phoneSchema = z.string().min(10, "numero de telefone invalido").max(11, "numero de telefone invalido")
  .refine(val => /^\d+$/.test(val), { message: "Telefone deve conter apenas números" });
    

const createStudentSchema = z.object({
  cpf: z.string().length(11),
  full_name: z.string().min(2),
  email: z.string().email(),
  parent_name: z.string().optional().nullable(),
  parent_phone: phoneSchema.optional().nullable(),
  student_phone: phoneSchema,
  address: z.string().min(5),
  date_of_birth: z.string(), // string ainda
  grade: z.number().int(),
  belt: z.nativeEnum(Belt).optional(),
  class_id: z.string().uuid().optional(),
  ifce_enrollment: enrollmentSchema
})

.superRefine((data, ctx) => {
  const date = normalizeDate(data.date_of_birth)

  if (isNaN(date.getTime())) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Data de nascimento inválida.",
      path: ['date_of_birth'],
    })
    return
  }

  const age = calculateAge(date)

  if (age < 4) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Aluno deve ter pelo menos 4 anos.",
      path: ['date_of_birth'],
    })
  }
})


export const createStudentController = async (req: AuthRequest, res: Response) => {
  try {
    const body = createStudentSchema.parse(req.body)

    const service = new CreateStudentsService(
      new PrismaStudentsRepository()
    )

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
      return res.status(400).json({
        message: 'Erro de validação',
        errors: err.issues.map(e => e.message)
      })
    }

    if (err instanceof EmailConflictError || err instanceof CPFConflictError) {
      return res.status(409).json({
        message: err.message
      })
    }

    console.error(err)
    return res.status(500).json({
      message: 'Erro interno ao criar aluno'
    })
  }
}
