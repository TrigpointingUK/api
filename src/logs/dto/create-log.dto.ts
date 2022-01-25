import {
  IsPositive,
  IsLongitude,
  IsLatitude,
  IsOptional,
  Length,
} from 'class-validator';

export class CreateLogDto {
  @IsOptional()
  @IsPositive()
  id: number;

  @IsPositive()
  trig_id: number;

  @Length(3, 50)
  text: string;

  @IsLatitude()
  wgs_lat?: number;

  @IsLongitude()
  wgs_lon?: number;
}
