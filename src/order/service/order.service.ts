import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service/prisma.service';
import { OrderDto } from '../dto/order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: OrderDto): Promise<OrderDto> {
    const { items, discount, ...orderData } = dto;

    const order = await this.prisma.order.create({
      data: {
        ...orderData,
        discount: discount,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { items: true },
    });

    return order;
  }

  async findAll(): Promise<OrderDto[]> {
    return this.prisma.order.findMany({
      include: { items: true, user: true },
    });
  }

  async fillOne(id: number): Promise<OrderDto | null> {
    return this.prisma.order.findUnique({
      where: { id },
      include: { items: true, user: true },
    });
  }

  async update(id: number, dto: OrderDto): Promise<OrderDto> {
    return this.prisma.order.update({
      where: { id },
      data: {
        ...dto,
        items: {
          deleteMany: {}, // xóa hết item cũ (hoặc filter theo nhu cầu)
          create: dto.items?.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: true,
      },
    });
  }

  async delete(id: number) {
    return this.prisma.order.delete({
      where: { id },
    });
  }
}
