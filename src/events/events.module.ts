import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  providers: [EventsGateway],
  exports: [EventsGateway],
})
export class EventsModule {}
