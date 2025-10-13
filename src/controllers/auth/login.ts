import z from 'zod'
import { prisma } from '../../lib'
import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import { signToken } from '../../lib/jwt'

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const login = async (req: Request, res: Response) => {
  try {
    const parsed = loginSchema.parse(req.body)
    const { email, password } = parsed

    const user = await prisma.users.findUnique({ where: { email } })
    if (!user) return res.status(401).json({ message: 'Credenciais inválidas' })

    const match = await bcrypt.compare(password, user.password)
    if (!match)
      return res.status(401).json({ message: 'Credenciais inválidas' })

    const token = signToken({ userId: user.id, role: user.role })
    res.json({
      token,
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ errors: err.message })
    }
    console.error(err)
    res.status(500).json({ message: 'Erro no servidor' })
  }
}
