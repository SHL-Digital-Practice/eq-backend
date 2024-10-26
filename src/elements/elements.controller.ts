import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ElementsService } from './elements.service';
import { CreateElementDto } from './dto/create-element.dto';
import { UpdateElementBulkDto } from './dto/update-element-bulk.dto';

@Controller('elements')
export class ElementsController {
  constructor(private readonly elementsService: ElementsService) {}

  @Post()
  createBulk(
    @Query('sessionId') sessionId: string,
    @Body() createElementDto: CreateElementDto[],
  ) {
    return this.elementsService.create(+sessionId, createElementDto);
  }

  @Get()
  async findAll() {
    return this.elementsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.elementsService.findOne(+id);
  }

  @Patch()
  async updateBulk(
    @Query('sessionId') sessionId: string,
    @Body() updateElementDto: UpdateElementBulkDto[],
  ) {
    return this.elementsService.updateBulk(+sessionId, updateElementDto);
  }

  @Delete()
  async removeBulk(@Body() ids: string[]) {
    return this.elementsService.removeBulk(ids);
  }
}
