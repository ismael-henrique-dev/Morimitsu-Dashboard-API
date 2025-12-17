import { GenValidationCode } from "../../utils/genValidEmailCode";
import { SendEmail, EmailType} from "../../lib/nodemailer";
import { prisma } from "../../lib";

export class SendRecoveryEmailService {
  async sendRecoveryEmail(userEmail: string) {
    const randomCode = GenValidationCode();

    const email: EmailType = {
      subject: "Recuperação de senha - Morimitsu Academy",
      to: userEmail,
      text: 'Recuperação de senha Morimitsu',
    }
    try { 
      await SendEmail(email);
      return `Email de recuperação enviado para ${userEmail}, código: ${randomCode}`;
    } catch (error) {
      throw new Error("Erro ao enviar o email de recuperação");
    }
  }
}
