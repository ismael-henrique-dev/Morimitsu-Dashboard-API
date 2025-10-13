import z from 'zod'
import bcrypt from 'bcrypt'

import { Request, Response } from 'express'
import { prisma } from '../../lib'
import { signToken } from '../../lib/jwt'

const SALT_ROUNDS = 10

export const registerSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  // role: z.enum(['admin', 'instructor']),
})

export const register = async (req: Request, res: Response) => {
  try {
    const parsed = registerSchema.parse(req.body)
    const { username, email, password } = parsed

    const existing = await prisma.users.findFirst({
      where: { OR: [{ email }] },
    })

    if (existing)
      return res.status(400).json({ message: 'User already exists' })

    const hash = await bcrypt.hash(password, SALT_ROUNDS)
    const user = await prisma.users.create({
      data: { username, email, password: hash, role: 'admin' },
    })

    const token = signToken({ userId: user.id, role: user.role })

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      token,
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ errors: err.message })
    }
    console.error(err)
    res.status(500).json({ message: 'Internal server error' })
  }
}
