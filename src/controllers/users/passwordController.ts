// controllers/users/passwordControllerMemory.ts
import { Request, Response } from 'express';
import { SendRecoveryMemoryService } from '../../services/users/sendRecoveryEmail';
import { ResetPasswordMemoryService } from '../../services/users/resetPassword';

const sendRecovery = new SendRecoveryMemoryService();
const resetPassword = new ResetPasswordMemoryService();

export const sendRecoveryController = async (req: Request, res: Response) => {
  const { email } = req.body;
  const result = await sendRecovery.execute(email);
  return res.json(result);
};

export const resetPasswordController = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;
  const result = await resetPassword.execute(token, newPassword);
  return res.json(result);
};
