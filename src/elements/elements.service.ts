import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateElementDto } from './dto/create-element.dto';
import { UpdateElementDto } from './dto/update-element.dto';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../database/schema';
import { elements } from '../database/schema';
import { and, eq, inArray } from 'drizzle-orm';
import { UpdateElementBulkDto } from './dto/update-element-bulk.dto';

@Injectable()
export class ElementsService {
  constructor(@Inject('DB_EQ') private db: PostgresJsDatabase<typeof schema>) {}
  async create(sessionId: number, data: CreateElementDto[]) {
    type InsertUser = typeof elements.$inferInsert;
    const dataMapped: InsertUser[] = data.map((d) => ({
      sessionId,
      applicationId: d.applicationId,
      properties: d.properties,
      type: d.type,
    }));
    return await this.db.insert(elements).values(dataMapped);
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
    console.log('sessionId', sessionId);
    for (const input of inputs) {
      if (!input.applicationId) {
        throw new BadRequestException('applicationId is required');
      }

      await this.db
        .update(elements)
        .set(input)
        .where(
          and(
            eq(elements.sessionId, sessionId),
            eq(elements.applicationId, input.applicationId),
          ),
        );
    }
  }

  async removeBulk(ids: string[]) {
    return await this.db
      .delete(elements)
      .where(inArray(elements.applicationId, ids));
  }
}
