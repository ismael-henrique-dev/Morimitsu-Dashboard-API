import { class_sessions } from "@prisma/client";
import { SessionRepositoryInterface } from "../../repositories/sessions";

export interface CreateSessionRequest {
  session_date: Date;
  instructorId: string;
  class_id: string;
}

export class CreateSessionsService {
  constructor(
    private sessionsRepository: SessionRepositoryInterface
  ) {}

  async handle(data: CreateSessionRequest): Promise<class_sessions> {
    return this.sessionsRepository.getOrCreateSessionByDate(
      data.class_id,
      data.instructorId,
      data.session_date
    );
  }
}
