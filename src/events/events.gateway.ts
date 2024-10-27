import { Logger } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class EventsGateway {
  private readonly logger = new Logger(EventsGateway.name);

  @WebSocketServer()
  private readonly server: Server;

  participants: number[] = [];

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
    this.logger.debug(`user joined: ${userId}`);
    this.participants.push(userId);
    this.server.emit('participants', this.participants);
  }

  handleDisconnect(client: Socket) {
    const userId = parseInt(client.handshake.query.userId as string);
    this.logger.debug(`users left: ${userId}`);
    this.participants = this.participants.filter((id) => id !== userId);
    this.server.emit('participants', this.participants);
  }

  handleElementsEvent(data: any) {
    this.logger.debug(`elements event received: ${JSON.stringify(data)}`);
    this.server.emit('events', data);
  }
}
