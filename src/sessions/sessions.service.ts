import { Inject, Injectable } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';

import * as schema from '../database/schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { sessions } from '../database/schema';
import { UpdateSessionDto } from './dto/update-session.dto';
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

  findAll() {
    return `This action returns all sessions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} session`;
  }

  update(id: number, updateSessionDto: UpdateSessionDto) {
    console.log('updateSessionDto', updateSessionDto);
    return `This action updates a #${id} session`;
  }

  remove(id: number) {
    return `This action removes a #${id} session`;
  }
}
