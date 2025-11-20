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
        message: "Matrícula IFCE deve ter 14 dígitos e conter apenas números."
      })
  );

const createStudentSchema = z.object({
    cpf: z.string().min(11, {message: "CPF inválido"}).max(11, {message: "CPF inválido"}),
    full_name: z.string().min(2, "Nome inválido"),
    email: z.string().email({ message: "Email inválido" }),
    parent_name: z.string().min(2, "Nome do responsável inválido").optional().nullable(),
    parent_phone: z.string().min(8,{ message:"Telefone do responsável inválido"} ).optional().nullable(),
    student_phone: z.string().min(8, { message: "Telefone do aluno inválido" }),
    address: z.string().min(5, "Endereço inválido"),
    date_of_birth: z.string().transform((v) => new Date(v)),
    grade: z.number().int("O grau deve ser um número inteiro"),
    belt: z.nativeEnum(Belt).optional(),
    class_id: z.string().uuid().optional(),
    ifce_enrollment: enrollmentSchema,
})
// O superRefine agora só checa se a data de nascimento é válida (a lógica de idade condicional foi removida).
.superRefine((data, ctx) => {
    if (isNaN(data.date_of_birth.getTime())) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Data de nascimento inválida (formato incorreto).",
            path: ['date_of_birth'],
        })
        return
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

        console.error(err)
        return res.status(500).json({ message: "Erro interno ao criar aluno" })
    }
}