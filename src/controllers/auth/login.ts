import { prisma } from '../../lib'
import { Request, Response } from 'express'
import { signToken } from '../../lib/jwt'
import z from 'zod'
import bcrypt from 'bcrypt'

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body)

    const user = await prisma.users.findUnique({ where: { email } })

    if (!user)
      return res.status(401).json({ message: 'Email or password incorrects' })

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid)
      return res.status(401).json({ message: 'Email or password incorrects' })

    const token = signToken({ userId: user.id, role: user.role })

    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    }

    res.json({
      token,
      data: userData,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map((issue) => ({
        field: issue.path[0],
        message: issue.message,
      }))

      return res.status(400).json({
        message: 'Validation error',
        errors,
      })
    }

    console.error('[LOGIN_ERROR]', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
