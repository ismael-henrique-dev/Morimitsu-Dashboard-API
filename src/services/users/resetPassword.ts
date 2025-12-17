// services/users/resetPasswordMemory.ts
import { SendRecoveryMemoryService } from './sendRecoveryEmail';

export class ResetPasswordMemoryService {
  async execute(token: string, newPassword: string) {
    // 1️⃣ Valida token
    const email = SendRecoveryMemoryService.validateToken(token);

    // 2️⃣ “Atualiza” a senha do usuário em memória (ou só loga)
    console.log(`Senha do usuário ${email} alterada para: ${newPassword}`);

    // 3️⃣ Remove token
    // Se você quiser, pode acessar o Map diretamente ou criar método na classe SendRecoveryMemoryService
    return { message: 'Senha redefinida com sucesso', email };
  }
}
