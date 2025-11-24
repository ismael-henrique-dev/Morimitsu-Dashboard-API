import { Response } from 'express'
import { AuthRequest } from '../../middlewares/auth'
import { UpdateStudentService } from '../../services/students/update'
import { PrismaStudentsRepository } from '../../repositories/students'
import { z } from 'zod'
import { Belt } from '@prisma/client'

const updateStudentSchema = z.object({
    email: z.string().email('Email inválido').optional(),
    id: z.string().uuid({ message: 'ID inválido' }),
    grade: z.number().int('A série deve ser um número inteiro').optional(),
    belt: z.nativeEnum(Belt).optional(),
    personal_info: z.object({
        full_name: z.string().min(2, 'Nome inválido').optional(),
        parent_name: z.string().min(2, 'Nome do responsável inválido').optional().nullable(),
        parent_phone: z.string().min(8, { message: "Telefone do responsável inválido" }).optional().nullable(),
        student_phone: z.string().min(8, { message: "Telefone do aluno inválido" }).optional(),
        address: z.string().min(5, 'Endereço inválido').optional(),
        date_of_birth: z.date().optional(),
    }).optional(),
})

export const updateStudentsController = async (req: AuthRequest, res: Response) => {
    try {
        const parsedData = updateStudentSchema.parse({
            id: req.params.id,
            ...req.body,
        })

        const service = new UpdateStudentService(new PrismaStudentsRepository())

        const updatePayload: any = {}
        
        if (parsedData.grade !== undefined) updatePayload.grade = parsedData.grade
        if (parsedData.belt !== undefined) updatePayload.belt = parsedData.belt
        if (parsedData.email !== undefined) updatePayload.email = parsedData.email
        
        // Esta linha envia o objeto aninhado que o Repositório espera:
        if (parsedData.personal_info) {
            updatePayload.personal_info = parsedData.personal_info
        }
        
        const _response = await service.update(parsedData.id, updatePayload)

        const { 
            ifce_enrollment, 
            class_id,               // Chave estrangeira interna
            current_frequency,      // Campos de controle interno
            total_frequency,        // Campos de controle interno
            ...studentPublicData    // O resto dos dados (públicos)
        } = _response;

        // 2. Opcional: Re-formatar os dados para garantir que a saída final seja limpa,
        // especialmente a data de nascimento, se necessário.
        const personalInfo = studentPublicData.personal_info || {};
        let dateOfBirthFormatted = personalInfo.date_of_birth
            ? new Date(personalInfo.date_of_birth).toLocaleDateString('pt-BR')
            : null;

        // 3. Montar o objeto de resposta final
        const formattedResponse = {
            // Campos raiz (restantes de studentPublicData)
            id: studentPublicData.id,
            email: studentPublicData.email,
            grade: studentPublicData.grade,
            belt: studentPublicData.belt,
            
            // Campos aninhados (personal_info)
            personal_info: {
                full_name: personalInfo.full_name || null,
                cpf: personalInfo.cpf || null,
                date_of_birth: dateOfBirthFormatted, 
                student_phone: personalInfo.student_phone || null,
                parent_phone: personalInfo.parent_phone || null,
                parent_name: personalInfo.parent_name || null,
                address: personalInfo.address || null,
            }
        };
        
        // 4. Retorno final com o objeto filtrado
        return res.status(200).json({
             message: 'Aluno atualizado com sucesso!',
             result: formattedResponse, // Retorna apenas o objeto sem ifce_enrollment
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: 'Dados inválidos', issues: error.issues })
        }

        console.error(error)
        return res.status(500).json({ message: 'Erro interno do servidor' })
    }
}