import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';

import * as schema from '../database/schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { sessions } from '../database/schema';
import { UpdateSessionDto } from './dto/update-session.dto';
import { eq } from 'drizzle-orm';
// import { UpdateSessionDto } from './dto/update-session.dto';

@Injectable()
export class SessionsService {
  constructor(@Inject('DB_EQ') private db: PostgresJsDatabase<typeof schema>) {}
  async create(createSessionDto: CreateSessionDto) {
    return await this.db.insert(sessions).values(createSessionDto).returning({
      id: sessions.id,
      ownerId: sessions.ownerId,
    });
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

  findAll() {
    return `This action returns all sessions`;
  }

  update(id: number, updateSessionDto: UpdateSessionDto) {
    console.log('updateSessionDto', updateSessionDto);
    return `This action updates a #${id} session`;
  }

  remove(id: number) {
    return `This action removes a #${id} session`;
  }
}
