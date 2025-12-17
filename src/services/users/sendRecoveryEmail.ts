// services/users/sendRecoveryMemory.ts
import crypto from 'crypto';

type TokenRecord = {
  email: string;
  token: string;
  expires: number; // timestamp
};

// Simula o "banco" em memória
const tokens: Map<string, TokenRecord> = new Map();

// services/users/sendRecoveryMemory.ts
export class SendRecoveryMemoryService {
  static tokens: Map<string, TokenRecord> = new Map();

  async execute(email: string) {
    const token = crypto.randomBytes(20).toString('hex');
    const expires = Date.now() + 1000 * 60 * 60;
    SendRecoveryMemoryService.tokens.set(token, { email, token, expires });
    console.log(`Token gerado: ${token} para o usuário: ${email}`);
    return { message: 'Token gerado com sucesso', token };
  }

  static validateToken(token: string) {
    const record = SendRecoveryMemoryService.tokens.get(token);
    if (!record) throw new Error('Token inválido');
    if (record.expires < Date.now()) {
      SendRecoveryMemoryService.tokens.delete(token);
      throw new Error('Token expirado');
    }
    return record.email;
  }
}
