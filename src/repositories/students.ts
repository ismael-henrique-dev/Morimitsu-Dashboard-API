
import { Prisma, students, Belt } from '@prisma/client'
import { prisma } from '../lib'

// Tipo de retorno com a relação incluída
type StudentWithPersonalInfo = students & { personal_info: any | null }

// 🚨 NOVO TIPO: Reflete a estrutura ANINHADA que o Controller envia
export interface UpdateStudentPayloadFromController {
    grade?: number
    belt?: Belt
    email?: string
    class_id?: string | null
    ifce_enrollment?: string | null

    personal_info?: {
        full_name?: string
        parent_name?: string | null
        parent_phone?: string | null
        student_phone?: string
        address?: string // AQUI o address está aninhado
        date_of_birth?: Date
    }
}

export interface StudentsRepositoryInterface {
    create(data: Prisma.studentsCreateInput): Promise<StudentWithPersonalInfo>
    delete(studentId: string): Promise<void>
    get(search: string | null): Promise<StudentWithPersonalInfo[]>
    // 🚨 ATUALIZAÇÃO: Usa o novo tipo aninhado
    update(studentId: string, data: UpdateStudentPayloadFromController): Promise<StudentWithPersonalInfo>
    findByEmail(email: string): Promise<StudentWithPersonalInfo | null>
    details(id: string): Promise<StudentWithPersonalInfo | null>
}

export class PrismaStudentsRepository implements StudentsRepositoryInterface {
    
    // ... (Seus métodos create, findByEmail, details, delete, get) ...

    async create(data: Prisma.studentsCreateInput) {
        const student = await prisma.students.create({
            data,
            include: { personal_info: true },
        })
        return student
    }

    async findByEmail(email: string): Promise<StudentWithPersonalInfo | null> {
        const student = await prisma.students.findUnique({
            where: { email },
            include: { personal_info: true },
        })
        return student
    }

    async details(id: string): Promise<StudentWithPersonalInfo | null> {
        const student = await prisma.students.findUnique({
            where: { id },
            include: { personal_info: true },
        })
        return student
    }

    async delete(studentId: string): Promise<void> {
        await prisma.personal_info.deleteMany({ where: { student_id: studentId } })
        await prisma.graduations.deleteMany({ where: { student_id: studentId } })
        await prisma.announcements.deleteMany({ where: { student_id: studentId } })
        await prisma.student_attendance.deleteMany({ where: { student_id: studentId } })

        await prisma.students.delete({ where: { id: studentId } })
    }

    async get(search: string | null): Promise<StudentWithPersonalInfo[]> {
        return prisma.students.findMany({
            where: search
                ? {
                    personal_info: {
                        full_name: { contains: search, mode: 'insensitive' },
                    },
                }
                : {},
            include: { personal_info: true },
        })
    }
    async update(studentId: string, data: UpdateStudentPayloadFromController): Promise<StudentWithPersonalInfo> {
        
        // 1. Separação: Extrai 'personal_info' e o resto vai para 'studentData' (nível raiz)
        const { personal_info, ...studentData } = data; 
        
        // Tratamos class_id separadamente para montar a relação corretamente
        const classIdValue = (studentData as any).class_id;
        if ('class_id' in (studentData as any)) {
            delete (studentData as any).class_id;
        }

        // Inicializa o objeto de atualização da tabela students de forma segura para o Prisma
        let finalUpdateData: Prisma.studentsUpdateInput = {} as Prisma.studentsUpdateInput;

        // Converte campos raiz: se o valor for null usamos a operação { set: null }, caso contrário usamos o valor direto
        for (const key in studentData) {
            const value = (studentData as any)[key];
            if (value === undefined) continue;

            // Para campos que aceitam StringFieldUpdateOperationsInput, números etc., Prisma aceita o valor direto,
            // mas para explicitamente atribuir null devemos usar { set: null }.
            if (value === null) {
                (finalUpdateData as any)[key] = { set: null };
            } else {
                (finalUpdateData as any)[key] = value;
            }
        }
        
        // 2. TRATAMENTO DO PAYLOAD ANINHADO
        if (personal_info) {
            
            const personalInfoUpdateData: Partial<Prisma.personal_infoUpdateInput> = {};
            
            // Itera SOMENTE sobre os campos de personal_info (incluindo address)
            for (const key in personal_info) {
                const value = (personal_info as any)[key];
                
                if (value !== undefined) {
                    // Garante que o address e outros campos nuláveis sejam atualizados.
                    (personalInfoUpdateData as any)[key] = value ?? null; 
                }
            }
            
            // 3. Constrói a operação aninhada do Prisma
            if (Object.keys(personalInfoUpdateData).length > 0) {
                 (finalUpdateData as any).personal_info = { 
                    update: personalInfoUpdateData // A operação 'update' é adicionada aqui, não no Controller
                 };
            }
        }
        
        // 4. TRATAMENTO DE CHAVES ESTRANGEIRAS (class_id)
        if (classIdValue !== undefined) {
            if (classIdValue !== null) {
                (finalUpdateData as any).class = { connect: { id: classIdValue as string } };
            } else {
                (finalUpdateData as any).class = { disconnect: true };
            }
        }
        
        // 5. EXECUÇÃO DA ATUALIZAÇÃO
        return await prisma.students.update({
            where: { id: studentId },
            data: finalUpdateData,
            include: { personal_info: true },
        });
    }
}