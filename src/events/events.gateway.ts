import { Logger } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { NotificationsService } from 'src/notifications/notifications.service';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class EventsGateway {
  private readonly logger = new Logger(EventsGateway.name);

  constructor(private readonly notificationsService: NotificationsService) {}

  @WebSocketServer()
  private readonly server: Server;

  participants: Set<number> = new Set();

  @SubscribeMessage('events')
  handleEvent(
    @MessageBody() data: string,
    // @ConnectedSocket() client: Socket,
  ): string {
    this.logger.debug(`event received: ${JSON.stringify(data)}`);
    return data;
  }

  @SubscribeMessage('join')
  handleJoinEvent(@MessageBody() data: { userId: number }) {
    this.logger.debug(`join event received: ${JSON.stringify(data)}`);
    this.server.emit('join', data);
  }

  handleConnection(client: Socket) {
    // logger connection parameters
    const userId = parseInt(client.handshake.query.userId as string);
    if (!userId) return;
    this.logger.debug(`user joined: ${userId}`);
    this.participants.add(userId);
    this.server.emit('participants', Array.from(this.participants));
  }

  handleDisconnect(client: Socket) {
    const userId = parseInt(client.handshake.query.userId as string);
    this.logger.debug(`users left: ${userId}`);
    this.participants.delete(userId);
    this.server.emit('participants', Array.from(this.participants));
  }

  handleElementsEvent(data: any, sql?: string) {
    this.logger.debug(`elements event received: ${JSON.stringify(data)}`);
    if (sql) {
      this.notificationsService.createNotificationFromSQL(sql);
    }
    this.server.emit('events', data);
  }
}
