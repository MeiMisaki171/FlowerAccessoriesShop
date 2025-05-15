import { ApiProperty } from '@nestjs/swagger';
import { IsArray, isNumber, IsNumber, IsOptional, IsString } from 'class-validator';

export class OrderDto {
  @ApiProperty()
  @IsNumber()
  userId: number;

  @ApiProperty()
  @IsNumber()
  total: number;

  @ApiProperty()
  @IsString()
  status: string;

  @ApiProperty()
  @IsString()
  shippingAddress: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  discount: number | null;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  shippingFee?: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  voucher: string | null;

  @ApiProperty()
  @IsArray()
  items: orderItemsDto[];
}

export class orderItemsDto {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsNumber()
  orderId: number;

  @ApiProperty()
  @IsNumber()
  productId: number;

  @ApiProperty()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
