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
import { UpdateElementDto } from './dto/update-element.dto';
import { UpdateElementBulkDto } from './dto/update-element-bulk.dto';

@Controller('elements')
export class ElementsController {
  constructor(private readonly elementsService: ElementsService) {}

  @Post()
  create(
    @Query('sessionId') sessionId: string,
    @Body() createElementDto: CreateElementDto,
  ) {
    return this.elementsService.create(+sessionId, [createElementDto]);
  }

  @Post('bulk')
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

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateElementDto: UpdateElementDto,
  ) {
    return this.elementsService.update(+id, updateElementDto);
  }

  @Patch('bulk')
  async updateBulk(
    @Query('sessionId') sessionId: string,
    @Body() updateElementDto: UpdateElementBulkDto[],
  ) {
    return this.elementsService.updateBulk(+sessionId, updateElementDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.elementsService.remove(+id);
  }

  @Delete('bulk')
  async removeBulk(@Body() ids: number[]) {
    return this.elementsService.removeBulk(ids);
  }
}
