import { Module } from '@nestjs/common';
import { ProductsController } from './controller/products.controller';
import { ProductsService } from './service/product.service';
import { PrismaModule } from 'prisma/prisma.module/prisma.module';
import { ImageModule } from 'src/image/image.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
  imports: [PrismaModule, ImageModule],
})
export class ProductsModule {}
