import {
  Body,
  Controller,
  Get,
  Inject,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from './database/schema';
import { eq } from 'drizzle-orm';
import { EventsGateway } from './events/events.gateway';
import { NotificationsService } from './notifications/notifications.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('DB_EQ') private db: PostgresJsDatabase<typeof schema>,

    private readonly eventsGateway: EventsGateway,

    private readonly notificationsService: NotificationsService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('users')
  getUsers(@Query('ids') ids: string) {
    const idArray = ids ? ids.split(',').map((id) => parseInt(id)) : [];
    return this.appService.getUsers(idArray);
  }

  @Get('targets')
  async getTargets() {
    return await this.db.query.targets.findFirst({
      where: eq(schema.targets.id, 1),
    });
  }

  @Patch('targets')
  async createTarget(@Body() body: { [key: string]: number }) {
    await this.db
      .update(schema.targets)
      .set({
        data: body,
      })
      .where(eq(schema.targets.id, 1));

    this.eventsGateway.handleElementsEvent('targets updated');
    return 'ok';
  }

  @Get('notifications')
  async getNotifications() {
    return this.notificationsService.getRecentNotifications();
  }
}
