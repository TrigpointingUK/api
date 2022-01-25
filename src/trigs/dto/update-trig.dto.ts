import { PartialType } from '@nestjs/mapped-types';
import { CreateTrigDto } from './create-trig.dto';

export class UpdateTrigDto extends PartialType(CreateTrigDto) {}
