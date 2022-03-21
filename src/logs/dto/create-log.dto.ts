import {
  IsPositive,
  IsLongitude,
  IsLatitude,
  IsOptional,
  Length,
  isDateString,
  IsDateString,
  IsNumber,
  Min,
  IsEnum,
  IsMilitaryTime,
} from 'class-validator';
import { isNumber } from 'lodash';
import { LogSource, TrigCondition } from 'src/enum_types';
import { Timestamp } from 'typeorm';

export class CreateLogDto {
  @IsOptional()
  @IsPositive()
  id: number;

  @IsPositive()
  trig_id: number;

  @IsPositive()
  user_id: number;

  @IsDateString()
  visit_date: Date;

  @IsMilitaryTime()
  @IsOptional()
  visit_time?: Date;

  @IsDateString()
  visit_timestamp: Date;

  @Length(0, 20000)
  @IsOptional()
  comment?: string;

  @IsLatitude()
  @IsOptional()
  wgs_lat?: number;

  @IsLongitude()
  @IsOptional()
  wgs_lon?: number;

  @Min(-100)
  @IsOptional()
  wgs_height?: number;

  // @Min(0)
  @IsOptional()
  osgb_eastings?: number;

  @Min(0)
  @IsOptional()
  osgb_northings?: number;

  @Min(-100)
  @IsOptional()
  osgb_height?: number;

  @Length(14, 14)
  @IsOptional()
  osgb_gridref?: string;

  @Length(3, 10)
  @IsOptional()
  fb_number?: string;

  @IsEnum(TrigCondition)
  condition: TrigCondition;

  @IsEnum(LogSource)
  @IsOptional()
  source?: LogSource;


}
