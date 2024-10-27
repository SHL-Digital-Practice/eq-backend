import { Inject, Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../database/schema';
import { desc } from 'drizzle-orm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  constructor(
    @Inject('DB_EQ') private db: PostgresJsDatabase<typeof schema>,
    private readonly configService: ConfigService,
  ) {}
  async createNotificationFromSQL(sql: string, user?: string) {
    const openai = new OpenAI({
      apiKey: this.configService.getOrThrow('OPENAI_API_KEY'),
    });

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `
        You're a helpful assistant, 
        based on the SQL query before, translate that to a human understandable short message. 
        Be extremely concise and encapsulate the action in just 1 sentence.
        Idenfity what type of element is involved by looking at the values.
        Don't use the word "element" in the response.
        Focus on the params of the query.
        Use emojis and be super friendly.
        
        Examples to follow: "Two rooms were added."`,
        },
        {
          role: 'user',
          content: sql,
        },
      ],
    });

    const notificationContent = response.choices[0].message.content;
    this.logger.debug(
      `response: ${JSON.stringify(response.choices[0].message.content)}`,
    );

    if (notificationContent) {
      this.db.insert(schema.notifications).values({
        content: notificationContent,
      });
    }
  }

  async getRecentNotifications() {
    return this.db
      .select({
        content: schema.notifications.content,
        createdAt: schema.notifications.createdAt,
      })
      .from(schema.notifications)
      .orderBy(desc(schema.notifications.createdAt))
      .limit(5);
  }
}
