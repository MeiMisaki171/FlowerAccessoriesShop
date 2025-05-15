import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CategoryResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description?: string | null;

  @ApiProperty({
    type: () => [CategoryResponseDto],
    required: false,
  })
  @Type(() => CategoryResponseDto)
  children?: CategoryResponseDto[];

  @ApiProperty({
    type: () => CategoryResponseDto,
    required: false,
  })
  @Type(() => CategoryResponseDto)
  parent?: CategoryResponseDto | null;

  @ApiProperty()
  createdAt?: Date;

  @ApiProperty()
  updatedAt?: Date;
}
