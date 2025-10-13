import { Response } from 'express'
import { AuthRequest } from '../../middlewares/auth'
import { prisma } from '../../lib'

export const createClass = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !['instructor', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Acesso negado' })
    }

    const { name, ageRange, schedule } = req.body

    if (!name || !ageRange || !schedule) {
      return res.status(400).json({ message: 'Campos obrigatórios faltando' })
    }

    const newClass = await prisma.classes.create({
      data: {
        name: name,
        age_range: ageRange,
        schedule: schedule,
        instructor_id: req.user.userId,
      },
    })

    res.status(201).json({
      message: 'Turma criada com sucesso!',
      data: newClass,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Erro interno ao criar turma' })
  }
}
