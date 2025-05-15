import { Module } from '@nestjs/common';
import { OrderController } from './controller/order.controller';
import { OrderService } from './service/order.service';
import { PrismaModule } from 'prisma/prisma.module/prisma.module';
import { PrismaService } from 'prisma/prisma.service/prisma.service';

@Module({
  controllers: [OrderController],
  providers: [OrderService, PrismaService],
  exports: [OrderService],
  imports: [PrismaModule],
})
export class OrderModule {}
