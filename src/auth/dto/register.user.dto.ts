import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Length, MinLength } from 'class-validator';

export class RegisterUserDto {
  @ApiProperty()
  @IsString()
  @Length(10, 11)
  phone: string;

  @ApiProperty()
  @IsEmail()
  @IsOptional() // Email có thể optional khi đăng ký qua Google
  email?: string;

  @ApiProperty()
  @IsOptional()
  @MinLength(6)
  password?: string;
}
