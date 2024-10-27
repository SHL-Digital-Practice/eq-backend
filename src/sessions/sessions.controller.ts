import { Controller, Post, Body, Param, Get, Query } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dto/create-session.dto';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  create(@Body() createSessionDto: CreateSessionDto) {
    return this.sessionsService.create(createSessionDto);
  }

  @Post(':id/save')
  async save(@Param('id') id: string) {
    return this.sessionsService.saveSession(+id);
  }

  @Get('elements')
  async getElements(@Query('sessionId') sessionId: string) {
    return this.sessionsService.getSessionElements(+sessionId);
  }
}
