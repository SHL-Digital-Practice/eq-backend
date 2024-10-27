import { Inject, Injectable } from '@nestjs/common';
import * as schema from './database/schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { users } from './database/schema';
import { inArray } from 'drizzle-orm';

@Injectable()
export class AppService {
  constructor(@Inject('DB_EQ') private db: PostgresJsDatabase<typeof schema>) {}

  async getUsers(
    idArray: number[],
  ): Promise<{ id: number; avatar: string | null; name: string }[]> {
    const result = await this.db
      .select({
        name: users.name,
        id: users.id,
        avatar: users.avatar,
      })
      .from(users)
      .where(inArray(users.id, idArray));
    return result;
  }
  getHello(): string {
    return 'Hello World!';
  }
}
