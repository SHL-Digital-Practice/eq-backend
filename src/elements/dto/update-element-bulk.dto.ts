import { PartialType } from '@nestjs/mapped-types';
import { UpdateElementDto } from './update-element.dto';

export class UpdateElementBulkDto extends PartialType(UpdateElementDto) {
  id: number;
}
