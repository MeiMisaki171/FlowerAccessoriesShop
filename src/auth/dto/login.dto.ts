import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @IsString()
  account: string; // phone hoặc username

  @ApiProperty()
  @IsString()
  password: string;
}
