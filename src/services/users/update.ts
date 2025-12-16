import { Request, Response } from "express";
import { prisma } from "../../lib";
import { z } from "zod";

// Schema de validação
const updateUserSchema = z.object({
  username: z.string().min(2, "Nome inválido").optional(),
  email: z.string().email("Email inválido").optional(),
});

export const updateUserController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body = updateUserSchema.parse(req.body);

    // Verifica se usuário existe
    const existingUser = await prisma.users.findUnique({ where: { id } });
    if (!existingUser) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    // Verifica conflito de email
    if (body.email && body.email !== existingUser.email) {
      const emailExists = await prisma.users.findUnique({
        where: { email: body.email },
      });
      if (emailExists) {
        return res.status(409).json({ message: "Email já está em uso" });
      }
    }

    // Atualiza o usuário
    const updatedUser = await prisma.users.update({
      where: { id },
      data: body,
    });

    return res.status(200).json({
      message: "Usuário atualizado com sucesso",
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: err.message ?? "Erro interno do servidor" });
  }
};
