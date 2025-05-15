import { Module } from '@nestjs/common';
import { CartController } from './controller/cart.controller';
import { CartService } from './service/cart.service';
import { PrismaService } from '../../prisma/prisma.service/prisma.service';
import { PrismaModule } from '../../prisma/prisma.module/prisma.module';

@Module({
  controllers: [CartController],
  providers: [CartService, PrismaService],
  exports: [CartService],
  imports: [PrismaModule],
})
export class CartModule {}
