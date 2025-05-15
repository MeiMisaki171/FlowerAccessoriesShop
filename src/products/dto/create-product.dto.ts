import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  price: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  stock: number;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  categoryId: number;

  @ApiProperty({ default: false })
  @Transform(({ value }) => value ?? false)
  isCover: boolean;

  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    description: 'Tối đa 5 ảnh',
  })
  @IsOptional()
  images: any; // Chứa URL của các ảnh đã upload
}
