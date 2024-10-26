import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ElementsModule } from './elements/elements.module';

@Module({
  imports: [ElementsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
