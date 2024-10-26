import { Inject, Injectable } from '@nestjs/common';
import { CreateElementDto } from './dto/create-element.dto';
import { UpdateElementDto } from './dto/update-element.dto';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../database/schema';
import { elements } from '../database/schema';

@Injectable()
export class ElementsService {
  constructor(@Inject('DB_EQ') private db: PostgresJsDatabase<typeof schema>) {}
  async create(sessionId: string, data: CreateElementDto[]) {
    return await this.db.insert(elements).values(
      data.map((d) => ({
        sessionId,
        applicationId: d.applicationId,
        type: 'default',
      })),
    );
  }

  findAll() {
    return `This action returns all elements`;
  }

  findOne(id: number) {
    return `This action returns a #${id} element`;
  }

  update(id: number, updateElementDto: UpdateElementDto) {
    return `This action updates a #${id} element`;
  }

  remove(id: number) {
    return `This action removes a #${id} element`;
  }
}
