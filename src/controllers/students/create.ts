import { Response } from "express"
import { AuthRequest } from "../../middlewares/auth"
import { CreateStudentsService } from "../../services/students/create"
import { PrismaStudentsRepository } from "../../repositories/students"
import { z } from "zod"
import { Belt } from "@prisma/client"

const createStudentSchema = z.object({
  cpf: z.string().min(11, "CPF deve ter pelo menos 11 dígitos"),
  full_name: z.string().min(2, "Nome inválido"),
  email: z.string().email("Email inválido"),
  parent_name: z.string().min(2, "Nome do responsável inválido"),
  parent_phone: z.string().min(8, "Telefone do responsável inválido"),
  student_phone: z.string().min(8, "Telefone do aluno inválido"),
  address: z.string().min(5, "Endereço inválido"),
  date_of_birth: z.string().transform((v) => new Date(v)), // transforma string ISO em Date
  grade: z.number().int("A série deve ser um número inteiro"),
  belt: z.nativeEnum(Belt).optional(),
  class_id: z.string().uuid().optional(),
  ifce_enrollment: z.number().optional(),
})

export const createStudentController = async (req: AuthRequest, res: Response) => {
  try {
    const body = createStudentSchema.parse(req.body)

    const {
      cpf,
      full_name,
      email,
      parent_name,
      parent_phone,
      student_phone,
      address,
      date_of_birth,
      grade,
      belt,
      class_id,
      ifce_enrollment,
    } = body

    const service = new CreateStudentsService(new PrismaStudentsRepository())

    const student = await service.handle({
      cpf,
      full_name,
      email,
      parent_name,
      parent_phone,
      student_phone,
      address,
      date_of_birth,
      grade,
      belt: belt ?? Belt.white, // valor padrão
      class_id,
      ifce_enrollment,
    })

    // Formata para envio seguro ao front
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

    console.error(err)
    return res.status(500).json({ message: "Erro interno ao criar aluno" })
  }
}
