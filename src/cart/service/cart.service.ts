import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service/prisma.service';
import { CartResponseDto } from '../dto/cart.response.dto';
import { AddToCartDto } from '../dto/add-to-cart.dto';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async getCart(userId: number): Promise<CartResponseDto | null> {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) return null;

    const total = cart?.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    return { ...cart, total };
  }

  async addToCart(userId: number, dto: AddToCartDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
    });

    if (!product) {
      throw new NotFoundException('Không tìm thấy thông tin sản phẩm');
    }

    if (product.stock < dto.quantity) {
      throw new Error(`Chỉ còn ${product.stock} sản phẩm trong kho`);
    }

    let cart = await this.prisma.cart.findUnique({ where: { userId } });

    if (!cart) {
      cart = await this.prisma.cart.create({ data: { userId } });
    }

    const existingItem = await this.prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: dto.productId,
      },
    });

    if (existingItem) {
      return this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + dto.quantity,
        },
      });
    }

    return this.prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: dto.productId,
        quantity: dto.quantity,
      },
    });
  }

  async updateItemQuantity(itemId: number, quantity: number) {
    return this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });
  }

  async removeItem(itemId: number) {
    return this.prisma.cartItem.delete({
      where: {
        id: itemId,
      },
    });
  }

  async clearCart(userId: number) {
    const cart = await this.prisma.cart.findUnique({ where: { userId } });

    if (!cart) {
      throw new NotFoundException('Không tồn tại giỏ hàng');
    }

    return this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  }
}
