import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';

import * as schema from '../database/schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { sessions } from '../database/schema';
import { UpdateSessionDto } from './dto/update-session.dto';
import { desc, eq } from 'drizzle-orm';
import { ElementsService } from 'src/elements/elements.service';
// import { UpdateSessionDto } from './dto/update-session.dto';

@Injectable()
export class SessionsService {
  constructor(@Inject('DB_EQ') private db: PostgresJsDatabase<typeof schema>) {}
  async create(createSessionDto: CreateSessionDto) {
    return (
      await this.db.insert(sessions).values(createSessionDto).returning({
        id: sessions.id,
        ownerId: sessions.ownerId,
      })
    )[0];
  }

  async saveSession(id: number) {
    try {
      await this.db
        .update(sessions)
        .set({ saved: true })
        .where(eq(sessions.id, id))
        .returning({
          id: sessions.id,
        });
    } catch (error) {
      throw new BadRequestException('Not able to save session.');
    }
  }

  async findOne(id: number) {
    const session = await this.db.query.sessions.findFirst({
      where: eq(sessions.id, id),
    });

    if (!session) {
      throw new NotFoundException('Session not found.');
    }

    return session;
  }

  update(id: number, updateSessionDto: UpdateSessionDto) {
    console.log('updateSessionDto', updateSessionDto);
    return `This action updates a #${id} session`;
  }

  async isSessionOpen(id: number) {
    const result = await this.db
      .select({
        saved: sessions.saved,
      })
      .from(sessions)
      .where(eq(sessions.id, id))
      .limit(1);

    if (result.length === 0) {
      throw new NotFoundException('Session not found.');
    }

    const session = result[0];

    if (session.saved) return false;

    return true;
  }

  async findLatestSavedSession() {
    const result = await this.db
      .select()
      .from(sessions)
      .where(eq(sessions.saved, true))
      .orderBy(desc(sessions.createdAt))
      .limit(1);

    if (result.length === 0) return undefined;

    if (result.length > 0) return result[0];
  }

  async getSessionElements(sessionId: number) {
    return await this.db.query.elements.findMany({
      where: eq(sessions.id, sessionId),
    });
  }
}
