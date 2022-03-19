import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsPositive,
  IsUrl,
  Length,
  MaxLength,
} from 'class-validator';
import { Status, Licence, Units } from 'src/enum_types';

export class CreateUserDto {
  @IsOptional()
  @IsPositive()
  id: number;

  @Length(1, 50)
  nickname: string;

  @IsOptional()
  // @IsEmail()
  email?: string;

  @IsBoolean()
  email_verified: boolean;

  @IsOptional()
  @MaxLength(256)
  oauth?: string;

  @IsOptional()
  @MaxLength(50)
  firstname?: string;

  @IsOptional()
  @MaxLength(50)
  lastname?: string;

  @IsOptional()
  about?: string;

  @IsOptional()
  @MaxLength(1024)
  homepage?: string;

  @IsOptional()
  @IsUrl()
  avatar?: string;

  @IsOptional()
  @IsEnum(Units)
  units?: Units;

  @IsOptional()
  @IsEnum(Status)
  status_max?: Status;

  @IsOptional()
  @IsEnum(Licence)
  licence_default?: Licence;

  @IsOptional()
  @IsPhoneNumber("GB")
  mobile_number?: string;

  @IsOptional()
  @MaxLength(64)
  cryptpw?: string;
}
