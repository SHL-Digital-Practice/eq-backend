import { Inject, Injectable } from '@nestjs/common';
import { CreateElementDto } from './dto/create-element.dto';
import { UpdateElementDto } from './dto/update-element.dto';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../database/schema';
import { elements } from '../database/schema';
import { eq, inArray } from 'drizzle-orm';
import { UpdateElementBulkDto } from './dto/update-element-bulk.dto';

@Injectable()
export class ElementsService {
  constructor(@Inject('DB_EQ') private db: PostgresJsDatabase<typeof schema>) {}
  async create(sessionId: number, data: CreateElementDto[]) {
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

  async update(id: number, updateElementDto: UpdateElementDto) {
    return await this.db
      .update(elements)
      .set(updateElementDto)
      .where(eq(elements.id, id));
  }

  async updateBulk(sessionId: number, inputs: UpdateElementBulkDto[]) {
    // risky business
    await this.db
      .insert(elements)
      .values(inputs.map((d) => ({ sessionId, type: 'default', ...d })));
  }

  async remove(id: number) {
    return await this.db.delete(elements).where(eq(elements.id, id));
  }

  async removeBulk(ids: number[]) {
    return await this.db.delete(elements).where(inArray(elements.id, ids));
  }
}
