import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional()
  price?: number;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  stock?: number;

  @ApiPropertyOptional()
  categoryId?: number;

  @ApiPropertyOptional()
  isCover?: boolean;

  @ApiPropertyOptional()
  images: string[]; // Chứa URL của các ảnh đã upload
}
