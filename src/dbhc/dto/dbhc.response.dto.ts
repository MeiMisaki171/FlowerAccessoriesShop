import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class DbhcResponseDto {
  @ApiProperty()
  @IsString()
  MA_DBHC: string;

  @ApiProperty()
  @IsString()
  MA_CHA: string | null;

  @ApiProperty()
  @IsString()
  TEN: string | null;

  @ApiProperty()
  @IsNumber()
  level: number;
}
