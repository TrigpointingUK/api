import { Status, Licence, Units } from 'src/enum_types';

export class MyUserDto {
  id: number;
  nickname: string;
  email: string;
  email_verified: boolean;
  firstname: string;
  lastname: string;
  about: string;
  homepage: string;
  avatar: string;
  units: Units;
  status_max: Status;
  licence_default: Licence;
  mobile_number: string;
}
