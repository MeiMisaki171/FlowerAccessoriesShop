import { ApiProperty } from '@nestjs/swagger';

export class CartResponseDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  user: {
    id: number;
  } | null;
  @ApiProperty()
  items?:
    | {
        id: number;
        productId: number;
        product: {
          id: number;
          name: string;
          price: number;
          description: string | null;
        };
      }[]
    | null;
  @ApiProperty()
  total: number;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}
