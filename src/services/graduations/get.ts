import { PrismaGraduationsRepository } from "../../repositories/graduations";

export class GetGraduationsService {
  constructor(
    public graduationsRepository = new PrismaGraduationsRepository()
  ) {}

  async execute(studentId: string) {
    if (!studentId) {
      throw new Error("studentId é obrigatório.");
    }

    // Chama o repositório e retorna todas as graduações do aluno
    return await this.graduationsRepository.getGraduation(studentId);
  }
}
