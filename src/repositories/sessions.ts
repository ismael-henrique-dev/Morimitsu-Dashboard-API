import { class_sessions,Prisma } from "@prisma/client";
import { prisma } from "../lib";

export interface SessionRepositoryInterface {
  create(data: Prisma.class_sessionsCreateInput): Promise<class_sessions>;
}
export class PrismaSessionsRepository implements SessionRepositoryInterface {
    async create(data: Prisma.class_sessionsCreateInput): Promise<class_sessions> {
        const session = await prisma.class_sessions.create({
            data,
        });
        return session;
    }
}