import { Response } from 'express'
import { AuthRequest } from '../../middlewares/auth'
import { GetStudentsService } from '../../services/students/get'
import { PrismaStudentsRepository, SearchParam } from '../../repositories/students' 
import { Belt } from '@prisma/client'

export const getStudentsController = async (req: AuthRequest, res: Response) => {
    try {
        // Parse dos parâmetros da query padrão
        const search = req.query.search as string | undefined;
        const beltQuery = req.query.belt as string | undefined;
        const gradeQuery = req.query.grade as string | undefined;
        const currentPageQuery = req.query.currentPage as string | undefined;

        const filters: SearchParam = {};

        if (search) filters.full_name = search;

        if (beltQuery && Object.values(Belt).map(b => b.toLowerCase()).includes(beltQuery.toLowerCase())) {
            filters.belt = Belt[beltQuery.toLowerCase() as keyof typeof Belt];
        }

        if (gradeQuery) {
            const grade = parseInt(gradeQuery, 10);
            if (!isNaN(grade)) filters.grade = grade;
        }
        if (currentPageQuery) {
            const currentPage = parseInt(currentPageQuery, 10);
            }

        const service = new GetStudentsService(new PrismaStudentsRepository());
        const students = await service.getStudents(filters);

        if (!students || students.length === 0) {
            return res.status(404).json({ message: 'Nenhum aluno encontrado' });
        }

        const formattedStudents = students.map(student => {
            const personalInfo = student.personal_info || {};
            let dateOfBirthFormatted = null;
            if (personalInfo.date_of_birth) {
                dateOfBirthFormatted = new Date(personalInfo.date_of_birth).toLocaleDateString('pt-BR');
            }

            return {
                id: student.id || null,
                email: student.email || null,
                grade: student.grade || null,
                belt: student.belt || null,
                name: personalInfo.full_name || null,
                cpf: personalInfo.cpf || null,
                date_of_birth: dateOfBirthFormatted,
                student_phone: personalInfo.student_phone || null,
                parent_phone: personalInfo.parent_phone || null,
                parent_name: personalInfo.parent_name || null,
                address: personalInfo.address || null,
            };
        });

        return res.status(200).json({ message: 'Alunos encontrados', result: formattedStudents });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
};
