import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateElementDto } from './dto/create-element.dto';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../database/schema';
import { elements } from '../database/schema';
import { and, eq, inArray } from 'drizzle-orm';
import { UpdateElementBulkDto } from './dto/update-element-bulk.dto';
import { SessionsService } from '../sessions/sessions.service';
import { EventsGateway } from 'src/events/events.gateway';

@Injectable()
export class ElementsService {
  async getLatest(sessionId: number) {
    const output: {
      [key: string]: {
        current: number;
      };
    } = {};

    const result = await this.db.query.elements.findMany({
      where: eq(elements.sessionId, sessionId),
    });

    for (const element of result) {
      const properties = element.properties;
      const department = properties.department;
      if (!output[department]) {
        output[department] = {
          current: 0,
        };
      } else {
        output[department].current++;
      }
    }

    return output;
  }
  constructor(
    @Inject('DB_EQ') private db: PostgresJsDatabase<typeof schema>,

    private readonly eventsGateway: EventsGateway,
    private readonly sessionsService: SessionsService,
  ) {}
  async create(sessionId: number, data: CreateElementDto[]) {
    const isSessionOpen = await this.sessionsService.isSessionOpen(sessionId);
    if (!isSessionOpen) {
      throw new BadRequestException('Session is closed');
    }

    type InsertUser = typeof elements.$inferInsert;
    const dataMapped: InsertUser[] = data.map((d) => ({
      sessionId,
      applicationId: d.applicationId,
      properties: d.properties,
      type: d.type,
    }));

    this.eventsGateway.handleElementsEvent('elements created');
    return await this.db.insert(elements).values(dataMapped);
  }

  findAll() {
    return `This action returns all elements`;
  }

  findOne(id: number) {
    return `This action returns a #${id} element`;
  }

  async updateBulk(sessionId: number, inputs: UpdateElementBulkDto[]) {
    const isSessionOpen = await this.sessionsService.isSessionOpen(sessionId);
    if (!isSessionOpen) {
      throw new BadRequestException('Session is closed');
    }

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

    this.eventsGateway.handleElementsEvent('elements updated');
  }

  async removeBulk(sessionId: number, ids: string[]) {
    const isSessionOpen = await this.sessionsService.isSessionOpen(sessionId);
    if (!isSessionOpen) {
      throw new BadRequestException('Session is closed');
    }

    await this.db.delete(elements).where(inArray(elements.applicationId, ids));

    this.eventsGateway.handleElementsEvent('elements deleted');
  }
}
