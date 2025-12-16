import { PrismaAttendenceRepository } from "../../repositories/attendence";

export class GetAllForUpdateService {
  private repo = new PrismaAttendenceRepository();

  async execute(sessionId: string) {
    if (!sessionId) {
      throw new Error("sessionId é obrigatório.");
    }

    const session = await this.repo.getAllForUpdate(sessionId);

    if (!session) {
      throw new Error("Sessão não encontrada.");
    }

    return {
      class_id: session.class_id,
      session_date: session.session_date,
      attendances: session.attendances
    };
  }
}
