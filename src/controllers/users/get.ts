import { Response } from 'express'
import { AuthRequest } from '../../middlewares/auth'
import { GetUsersService } from '../../services/users/get'
import { PrismaUsersRepository } from '../../repositories/users'

export const getUsersController = async (req: AuthRequest, res: Response) => {
  try {
    const service = new GetUsersService(new PrismaUsersRepository())

    const users = await service.execute()

    return res.status(200).json({
      message: 'Lista de administradores e professores',
      users,
    })

  } catch (err) {
    console.error(err)
    return res.status(500).json({
      message: 'Erro interno do servidor',
    })
  }
}
