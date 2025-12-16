import { Response } from "express"
import { AuthRequest } from "../../middlewares/auth"
import { CPFConflictError, CreateStudentsService } from "../../services/students/create"
import { PrismaStudentsRepository } from "../../repositories/students"
import { number, string, z } from "zod"
import { Belt } from "@prisma/client"
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
    cpf: z.string().min(11).max(11).refine((cpf) => IsValidCpf(cpf), {
        message: "CPF inválido",
    }),
    full_name: z.string().min(2, "Nome inválido"),
    email: z.string().email({ message: "Email inválido" }),
    parent_name: z.string().min(2, "Nome do responsável inválido").optional().nullable(),
    parent_phone: phoneSchema.optional().nullable(),
    student_phone: phoneSchema,
    address: z.string().min(5, "Endereço inválido"),
    date_of_birth: z.string().transform((v) => new Date(v)),
    grade: z.number().int("O grau deve ser um número inteiro"),
    belt: z.nativeEnum(Belt).optional(),
    class_id: z.string().uuid().optional(),
    ifce_enrollment: enrollmentSchema,
})
.superRefine((data, ctx) => {
  const age = calculateAge(data.date_of_birth)

  if (age < 4) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Aluno deve ter pelo menos 4 anos.",
      path: ['date_of_birth']
    })
  }

  if (isNaN(data.date_of_birth.getTime())) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Data de nascimento inválida.",
      path: ['date_of_birth']
    })
  }
})

export const createStudentController = async (req: AuthRequest, res: Response) => {
    try {
        const body = createStudentSchema.parse(req.body)

        const {
            cpf, full_name, email, parent_name, parent_phone, student_phone, address, 
            date_of_birth, grade, belt, class_id, ifce_enrollment,
        } = body

        const service = new CreateStudentsService(new PrismaStudentsRepository())

        const student = await service.handle({
            cpf, full_name, email, parent_name, parent_phone, student_phone, address, 
            date_of_birth, grade, 
            belt: belt ?? Belt.white,
            class_id,
            ifce_enrollment: ifce_enrollment,
        })

        // Formatação para envio seguro ao front
        const formattedStudent = {
            id: student.id,
            email: student.email,
            grade: student.grade,
            belt: student.belt,
            class_id: student.class_id,
            ifce_enrollment: student.ifce_enrollment,
            personal_info: student.personal_info
                ? {
                    cpf: student.personal_info.cpf,
                    full_name: student.personal_info.full_name,
                    parent_name: student.personal_info.parent_name,
                    parent_phone: student.personal_info.parent_phone,
                    student_phone: student.personal_info.student_phone,
                    address: student.personal_info.address,
                    date_of_birth: student.personal_info.date_of_birth
                        ? new Date(student.personal_info.date_of_birth).toLocaleDateString("pt-BR")
                        : null,
                }
                : null,
        }

        return res.status(201).json({
            message: "Aluno criado com sucesso!",
            student: formattedStudent,
        })
    } catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(400).json({
                message: "Erro de validação",
                errors: err.issues.map((e) => e.message),
            })
        }
        if (err instanceof EmailConflictError) {
            return res.status(409).json({
                message: "Email inválido", 
            });
        }
        if (err instanceof CPFConflictError) {
            return res.status(409).json({
                message: "CPF inválido",
            });
        }

        console.error(err)
        return res.status(500).json({ message: "Erro interno ao criar aluno" })
    }
}