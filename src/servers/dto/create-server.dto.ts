import { IsOptional, IsPositive, Length } from 'class-validator';

export class CreateServerDto {
  @IsOptional()
  @IsPositive()
  id?: number;

  @Length(1,100)
  url: string;

  @Length(1,100)
  path: string;

  @Length(1,100)
  description: string;
}