import { Request, Response } from "express";
import { SendRecoveryEmailService } from "../../services/users/sendRecoveryEmail";
import { ResetPasswordService } from "../../services/users/resetPassword";

// Instâncias dos serviços
const sendRecoveryEmailService = new SendRecoveryEmailService();
const resetPasswordService = new ResetPasswordService();

export class PasswordController {
  // Rota: POST /password/recovery
  async sendRecoveryEmail(req: Request, res: Response) {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ error: "Email é obrigatório" });

      const result = await sendRecoveryEmailService.sendRecoveryEmail(email);
      return res.status(200).json({ message: result });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Rota: POST /password/reset
  async resetPassword(req: Request, res: Response) {
    try {
      const { refString, code } = req.body;
      if (!refString || !code) {
        return res.status(400).json({ error: "refString e código são obrigatórios" });
      }

      const result = await resetPasswordService.resetPassword(refString, code);
      return res.status(200).json({ message: result });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
