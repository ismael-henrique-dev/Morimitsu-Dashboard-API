import { SendRecoveryEmailService } from "./sendRecoveryEmail";
import { prisma } from "../../lib";
import { hash } from "crypto";
import bcrypt from "bcrypt";

export class ResetPasswordService {
  async resetPassword(refString: string, expectedCode: string) {
  const [email, code] = splitStringAtDash(refString);

  const doesUserExist = await prisma.users.findUnique({ where: { email } });
  if (!doesUserExist) throw new Error("Usuário não encontrado");

  if (code !== expectedCode) throw new Error("Código de recuperação inválido");

  const newPassword = email;
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.users.update({
    where: { email },
    data: { password: hashedPassword }
  });

  return "Senha redefinida com sucesso";
  }
}

function splitStringAtDash(refString: string): [string, string] {
  const parts = refString.split('-', 2);
  if (parts.length < 2) {
    throw new Error('String inválida: precisa conter um traço "-" separando as partes.');
  }
  return [parts[0], parts[1]];
}

const refString = "meuemail@exemplo.com-123456";
const [email, code] = splitStringAtDash(refString);

console.log(email); // "meuemail@exemplo.com"
console.log(code);  // "123456"
