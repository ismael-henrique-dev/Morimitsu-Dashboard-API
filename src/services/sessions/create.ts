import { class_sessions, Prisma } from "@prisma/client";
import {SessionRepositoryInterface} from "../../repositories/sessions"

export interface CreateSessionRequest {
    session_date: Date;
    instructorId: string;
    class_id: string;
}
export class CreateSessionsService {
    constructor(private sessionsRepository: SessionRepositoryInterface) {}
    async handle(data: CreateSessionRequest): Promise<class_sessions> {
    const sessionData: Prisma.class_sessionsCreateInput = {
        session_date: data.session_date,
        instructor: {
            connect: { id: data.instructorId },
        },
        class: {
            connect: { id: data.class_id },
        },
    };

    return await this.sessionsRepository.create(sessionData);
}
}