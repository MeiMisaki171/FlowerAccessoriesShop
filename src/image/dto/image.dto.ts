import { ApiProperty } from '@nestjs/swagger';

export class ImageDto {
  @ApiProperty()
  productId: number;

  @ApiProperty()
  imageUrl: string;
}
