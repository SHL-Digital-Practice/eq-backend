import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateElementDto } from './dto/create-element.dto';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../database/schema';
import { elements, sessions } from '../database/schema';
import { and, eq, inArray } from 'drizzle-orm';
import { UpdateElementBulkDto } from './dto/update-element-bulk.dto';
import { SessionsService } from '../sessions/sessions.service';
import { EventsGateway } from 'src/events/events.gateway';

@Injectable()
export class ElementsService {
  getLive() {
    return this.getLatest(2);
  }
  async getLatest(sessionId: number) {
    const data: {
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
      if (!data[department]) {
        data[department] = {
          current: 0,
        };
      } else {
        data[department].current++;
      }
    }

    const session = await this.db.query.sessions.findFirst({
      where: eq(sessions.id, sessionId),
      with: {
        owner: true,
      },
    });

    console.log('session', session);

    const output: {
      data: {
        [key: string]: {
          current: number;
        };
      };
      owner: {
        id: number;
        name: string;
        avatar: string;
      };
    } = {
      data,
      owner: {
        id: session!.owner.id!,
        name: session!.owner.name,
        avatar: session!.owner.avatar!,
      },
    };

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

    const query = this.db.insert(elements).values(dataMapped);
    const sqlText = query.toSQL().sql;
    this.eventsGateway.handleElementsEvent('elements created', sqlText);
    return await query;
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
    let textContent = '';
    for (const input of inputs) {
      if (!input.applicationId) {
        throw new BadRequestException('applicationId is required');
      }

      const query = this.db
        .update(elements)
        .set(input)
        .where(
          and(
            eq(elements.sessionId, sessionId),
            eq(elements.applicationId, input.applicationId),
          ),
        );

      const sqlText = query.toSQL().sql;
      textContent += sqlText;
      await query;
    }

    this.eventsGateway.handleElementsEvent('elements updated', textContent);
  }

  async removeBulk(sessionId: number, ids: string[]) {
    const isSessionOpen = await this.sessionsService.isSessionOpen(sessionId);
    if (!isSessionOpen) {
      throw new BadRequestException('Session is closed');
    }

    const query = this.db
      .delete(elements)
      .where(inArray(elements.applicationId, ids));

    const sqlText = query.toSQL().sql;
    await query;
    this.eventsGateway.handleElementsEvent('elements deleted', sqlText);
  }
}
