import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ElementsModule } from './elements/elements.module';
import { DrizzlePostgresModule } from '@knaadh/nestjs-drizzle-postgres';
import * as schema from './database/schema';

@Module({
  imports: [
    ElementsModule,
    DrizzlePostgresModule.registerAsync({
      tag: 'DB_EQ',
      useFactory() {
        return {
          postgres: {
            url: 'postgresql://admin:notsecure@localhost:5432/postgres',
          },
          config: { schema: { ...schema } },
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
