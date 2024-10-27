import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Query,
  Logger,
} from '@nestjs/common';
import { ElementsService } from './elements.service';
import { CreateElementDto } from './dto/create-element.dto';
import { UpdateElementBulkDto } from './dto/update-element-bulk.dto';

@Controller('elements')
export class ElementsController {
  private readonly logger = new Logger(ElementsController.name);

  constructor(private readonly elementsService: ElementsService) {}

  @Post()
  createBulk(
    @Query('sessionId') sessionId: string,
    @Body() createElementDto: CreateElementDto[],
  ) {
    return this.elementsService.create(+sessionId, createElementDto);
  }

  // @Get(':id')
  // async findOne(@Param('id') id: string) {
  //   return this.elementsService.findOne(+id);
  // }

  @Patch()
  async updateBulk(
    @Query('sessionId') sessionId: string,
    @Body() updateElementDto: UpdateElementBulkDto[],
  ) {
    return this.elementsService.updateBulk(+sessionId, updateElementDto);
  }

  @Delete()
  async removeBulk(
    @Query('sessionId') sessionId: string,
    @Body() ids: string[],
  ) {
    return this.elementsService.removeBulk(+sessionId, ids);
  }

  @Get('latest')
  async getLatest(@Query('sessionId') sessionId: string) {
    return this.elementsService.getLatest(+sessionId);
  }

  @Get('live')
  async getLive() {
    return this.elementsService.getLive();
  }
}
