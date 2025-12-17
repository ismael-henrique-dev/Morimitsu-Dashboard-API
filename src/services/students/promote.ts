import { PrismaStudentsRepository } from '../../repositories/students'
import { prisma } from '../../lib'
import { Belt } from '@prisma/client'

export class PromoteStudentService {
  constructor(private studentsRepo: PrismaStudentsRepository) {}

  async execute(studentId: string) {
    const student = await this.studentsRepo.details(studentId)
    if (!student) throw new Error('Aluno não encontrado')

    const promotableBelts = [Belt.purple, Belt.brown, Belt.black, Belt.red, Belt.red_black] as const
    type PromotableBelt = (typeof promotableBelts)[number]

    if (!(promotableBelts as readonly PromotableBelt[]).includes(student.belt as PromotableBelt)) {
      throw new Error('Aluno não possui faixa elegível para promoção')
    }

    const personalInfo = student.personal_info
    if (!personalInfo) throw new Error('Informações pessoais do aluno não encontradas')

    const { full_name, cpf } = personalInfo
    const { email } = student
    if (!full_name || !email || !cpf) throw new Error('Dados incompletos para cadastro de usuário')

    const existingUser = await prisma.users.findUnique({ where: { email } })
    if (existingUser) throw new Error('Usuário já existe')

    const newUser = await prisma.users.create({
      data: {
        username: full_name,
        password: cpf, // Senha inicial é CPF
        email,
        role: 'instructor'
      }
    })

    return newUser
  }
}
