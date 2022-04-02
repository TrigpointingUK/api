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
  IsBoolean,
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

  @Min(-100)
  @IsOptional()
  wgs_height?: number;

  @Min(0)
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

  @Length(3, 10)
  @IsOptional()
  fb_number?: string;

  @Length(1, 20)
  @IsOptional()
  stn_number?: string;

  @Length(1, 20)
  @IsOptional()
  stn_number_active?: string;

  @Length(1, 20)
  @IsOptional()
  stn_number_osgb36?: string;

  @Length(1, 20)
  @IsOptional()
  stn_number_passive?: string;

  @Min(0)
  @IsOptional()
  os_net_web_id?: number;

  @IsBoolean()
  @IsOptional()
  permission_ind?: boolean;

  @Length(1, 20)
  @IsOptional()
  postcode6?: string;

  @Length(1, 20)
  @IsOptional()
  county?: string;

  @Length(0, 20)
  @IsOptional()
  town?: string;
}
