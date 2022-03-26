import { IsDateString, IsEnum, IsIP, IsOptional, IsPositive, Length, Min } from "class-validator";
import { Licence, LogSource, PhotoType } from "src/enum_types";

export class CreatePhotoDto {
  @IsOptional()
  @IsPositive()
  id: number;

  @IsPositive()
  trig_id: number;

  @IsPositive()
  user_id: number;

  @IsPositive()
  log_id: number;

  @IsPositive()
  server_id: number;

  @Length(5,100)
  filename: string;

  @Min(0)
  filesize: number;

  @Min(0)
  height: number;

  @Min(0)
  width: number;

  @Length(5,100)
  icon_filename: string;

  @Min(0)
  icon_filesize: number;

  @Min(0)
  icon_height: number;

  @Min(0)
  icon_width: number;

  @IsOptional()
  @Length(1,100)
  caption: string;

  @IsOptional()
  @Length(1,10000)
  description: string;

  @IsEnum(Licence)
  licence: Licence;

  @IsEnum(LogSource)
  source: LogSource;

  @IsEnum(PhotoType)
  type: PhotoType;

  @IsOptional()
  @IsDateString()
  deletedAt?: string;

  @IsOptional()
  @IsDateString()
  crt_timestamp?: string;

  @IsOptional()
  @IsIP(4)
  crt_ip_addr?: string;
}
