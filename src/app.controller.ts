import { Body, Controller, Get, Inject, Patch, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from './database/schema';
import { eq } from 'drizzle-orm';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('DB_EQ') private db: PostgresJsDatabase<typeof schema>,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('targets')
  async getTargets() {
    return await this.db.query.targets.findFirst({
      where: eq(schema.targets.id, 1),
    });
  }

  @Patch('targets')
  async createTarget(@Body() body: { [key: string]: number }) {
    return await this.db
      .update(schema.targets)
      .set({
        data: body,
      })
      .where(eq(schema.targets.id, 1));
  }
}
