import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ElementsModule } from './elements/elements.module';
import { DrizzlePostgresModule } from '@knaadh/nestjs-drizzle-postgres';
import * as schema from './database/schema';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ElementsModule,
    ConfigModule.forRoot(),
    DrizzlePostgresModule.registerAsync({
      tag: 'DB_EQ',
      useFactory(configService: ConfigService) {
        return {
          postgres: {
            url: configService.getOrThrow<string>('DATABASE_URL'),
          },
          config: { schema: { ...schema } },
        };
      },
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
