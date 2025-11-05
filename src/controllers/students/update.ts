// import { Response } from 'express'
// import { AuthRequest } from '../../middlewares/auth'
// import { UpdateStudentService } from '../../services/students/update'
// import { PrismaStudentsRepository } from '../../repositories/students'
// import { z } from 'zod'

// const updateStudentSchema = z
//     .object({
//         id: z.string().uuid({message: 'Id invalidado'})
//         d: z.object({
//             full_name: z.string().min(2, "Nome inválido"),
//             email: z.string().email("Email inválido"),
//             parent_name: z.string().min(2, "Nome do responsável inválido"),
//             parent_phone: z.string().min(8, "Telefone do responsável inválido"),
//             student_phone: z.string().min(8, "Telefone do aluno inválido"),
//             address: z.string().min(5, "Endereço inválido"),
//             date_of_birth: z.string().transform((v) => new Date(v)),
//             grade: z.number().int("A série deve ser um número inteiro"),
//             belt: z.nativeEnum(Belt).optional(),
//         })

//     })
