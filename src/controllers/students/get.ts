import { Response } from 'express'
import { AuthRequest } from '../../middlewares/auth'
import { GetStudentsService } from '../../services/students/get'
import { PrismaStudentsRepository, SearchParam } from '../../repositories/students' 
import { z } from 'zod'
import { Belt } from '@prisma/client'

const getStudentsSchema = z.object({
    search: z.string().optional(),
})

export const getStudentsController = async (req: AuthRequest, res: Response) => {
    try {
        const { search } = getStudentsSchema.parse({
            search: typeof req.query.search === 'string' ? req.query.search : undefined,
        })

        const service = new GetStudentsService(new PrismaStudentsRepository())
        let filters: SearchParam = null; 

        if (search) {
            const grade = Number(search);
            const lowerSearch = search.toLowerCase(); 
            
            // 1. Filtro por Faixa (Belt)
            // Agora compara "white" (do input) com "white" (do Enum)
            if (lowerSearch in Belt) {
                filters = { belt: lowerSearch as Belt }; 
            } 
            // 2. Filtro por Série (Grade)
            else if (!Number.isNaN(grade)) {
                filters = { grade: grade }; 
            } 
            // 3. Filtro por Nome (Padrão)
            else {
                filters = { full_name: search }; 
            }
        }
        
        const students = await service.getStudents(filters);

        if (!students || students.length === 0) {
            return res.status(404).json({ message: 'Nenhum aluno encontrado' })
        }

        // 🔹 CÓDIGO DE FORMATAÇÃO CORRIGIDO (Manter a consistência)
        const formattedStudents = students.map((student) => {
            const personalInfo = student.personal_info || {};
            
            let dateOfBirthFormatted = null;
            if (personalInfo.date_of_birth) {
                try {
                    dateOfBirthFormatted = new Date(personalInfo.date_of_birth).toLocaleDateString('pt-BR');
                } catch (e) {
                    dateOfBirthFormatted = null;
                }
            }

            return {
                // Campos de 'students' 
                id: student.id || null,
                email: student.email || null,
                grade: student.grade || null,
                belt: student.belt || null,
                
                // Campos de 'personal_info' 
                name: personalInfo.full_name || null,
                cpf: personalInfo.cpf || null,
                date_of_birth: dateOfBirthFormatted, 
                student_phone: personalInfo.student_phone || null,
                parent_phone: personalInfo.parent_phone || null,
                parent_name: personalInfo.parent_name || null,
                address: personalInfo.address || null,
            }
        });

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