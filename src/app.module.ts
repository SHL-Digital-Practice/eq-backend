import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ElementsModule } from './elements/elements.module';
import { DrizzlePostgresModule } from '@knaadh/nestjs-drizzle-postgres';
import * as schema from './database/schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SessionsModule } from './sessions/sessions.module';
import { EventsModule } from './events/events.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ElementsModule,
    ConfigModule.forRoot({ isGlobal: true }),
    DrizzlePostgresModule.registerAsync({
      tag: 'DB_EQ',
      useFactory(configService: ConfigService) {
        return {
          postgres: {
            url: configService.getOrThrow<string>('DATABASE_URL'),
          },
          config: { schema: { ...schema }, logger: true },
        };
      },
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    SessionsModule,
    EventsModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
