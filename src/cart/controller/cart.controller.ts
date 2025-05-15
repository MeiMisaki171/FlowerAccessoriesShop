import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CartService } from '../service/cart.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AddToCartDto } from '../dto/add-to-cart.dto';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get(':userId')
  @ApiOperation({ summary: 'Lấy thông tin giỏ hàng theo user' })
  getCart(@Param('userId') userId: string) {
    return this.cartService.getCart(+userId);
  }

  @Post(':userId/add')
  @ApiOperation({ summary: 'Thêm vào giỏ hàng' })
  addToCart(@Param('userId') userId: string, @Body() data: AddToCartDto) {
    return this.cartService.addToCart(+userId, data);
  }

  @Patch(':userId/item/:itemId')
  @ApiOperation({ summary: 'Thay đổi số lượng sản phẩm' })
  updateItem(@Param('itemId') itemId: string, @Body() body: { quantity: number }) {
    return this.cartService.updateItemQuantity(+itemId, body.quantity);
  }

  @Delete(':userId/item/:itemId')
  @ApiOperation({ summary: 'Xóa sản phẩm trong giỏ hàng theo ID' })
  removeItem(@Param('itemId') itemId: string) {
    return this.cartService.removeItem(+itemId);
  }

  @Delete(':userId/clear')
  @ApiOperation({ summary: 'Xóa toàn bộ sản phẩm trong giỏ hàng' })
  clearCart(@Param('userId') userId: string) {
    return this.cartService.clearCart(+userId);
  }
}
