import {
  IsPositive,
  IsLongitude,
  IsLatitude,
  IsOptional,
  Length,
  IsDateString,
  IsNumber,
  Min,
  IsEnum,
  Max,
  IsIP,
} from 'class-validator';
import { LogSource, TrigCondition } from 'src/enum_types';

export class CreateLogDto {
  @IsOptional()
  @IsPositive()
  id: number;

  @IsPositive()
  trig_id: number;

  @IsPositive()
  user_id: number;

  @IsDateString()
  @IsOptional()
  visit_date?: string;

  @Length(5,8)
  @IsOptional()
  visit_time?: string;

  @IsDateString()
  @IsOptional()
  visit_timestamp?: Date;

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

  @Min(0)
  @Max(10)
  @IsOptional()
  score?: number;

  @IsEnum(LogSource)
  @IsOptional()
  source?: LogSource;

  @IsDateString()
  @IsOptional()
  crt_timestamp?: Date;

  @IsIP(4)
  @IsOptional()
  crt_ip_addr?: string;

}
