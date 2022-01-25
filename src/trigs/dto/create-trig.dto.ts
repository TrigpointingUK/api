import {
  TrigCondition,
  CurrentUse,
  HistoricUse,
  PhysicalType,
} from 'src/enum_types';

import {
  IsPositive,
  IsLongitude,
  IsLatitude,
  Min,
  IsOptional,
  Length,
  IsEnum,
} from 'class-validator';
import { Status } from 'src/enum_types';
// https://github.com/typestack/class-validator#validation-decorators

export class CreateTrigDto {
  @IsOptional()
  @IsPositive()
  id: number;

  @Length(3, 50)
  name: string;

  @IsLatitude()
  @IsOptional()
  wgs_lat: number;

  @IsLongitude()
  @IsOptional()
  wgs_lon: number;

  @Min(0)
  @IsOptional()
  osgb_eastings: number;

  @Min(0)
  @IsOptional()
  osgb_northings: number;

  @IsEnum(PhysicalType)
  physical_type: PhysicalType;

  @IsEnum(CurrentUse)
  current_use: CurrentUse;

  @IsEnum(HistoricUse)
  historic_use: HistoricUse;

  @IsEnum(TrigCondition)
  condition: TrigCondition;

  @IsEnum(Status)
  status: Status;
}
