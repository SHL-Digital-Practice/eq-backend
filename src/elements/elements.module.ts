import { Module } from '@nestjs/common';
import { ElementsService } from './elements.service';
import { ElementsController } from './elements.controller';
import { SessionsModule } from '../sessions/sessions.module';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [SessionsModule, EventsModule],
  controllers: [ElementsController],
  providers: [ElementsService],
})
export class ElementsModule {}
