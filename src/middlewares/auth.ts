import { Request, Response, NextFunction } from 'express'
import { ENV } from '../lib/env'
import jwt from 'jsonwebtoken'

const JWT_SECRET = ENV.JWT_SECRET || 'dev_secret'

export interface AuthRequest extends Request {
  user?: {
    userId: string
    role: string
  }
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ message: 'Token não fornecido' })
  }

  const token = authHeader.split(' ')[1]
  if (!token) {
    return res.status(401).json({ message: 'Token inválido' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string }
    req.user = decoded // ✅ salva o user no request
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido ou expirado' })
  }
}

// export function authenticate(req: Request, res: Response, next: NextFunction) {
//   const authHeader = req.headers.authorization

//   if (!authHeader)
//     return res.status(401).json({ message: 'Token não fornecido' })

//   const token = authHeader.split(' ')[1]
//   if (!token) return res.status(401).json({ message: 'Token inválido' })

//   try {
//     const result = jwt.verify(token, JWT_SECRET)
  
//     console.log('🔑 JWT_SECRET usado:', JWT_SECRET)
//     console.log('📦 Token decodificado:', result)

//     next()
//   } catch (err) {
//     return res.status(401).json({ message: 'Token inválido ou expirado' })
//   }
// }
