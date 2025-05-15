import { ApiProperty } from '@nestjs/swagger';

export class DbhcRequestDto {
  @ApiProperty()
  MA_DBHC: string;

  @ApiProperty()
  MA_CHA: string;

  @ApiProperty()
  level: number;
}
