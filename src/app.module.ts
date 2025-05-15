import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { PaymentModule } from './payment/payment.module';
import { OrderModule } from './order/order.module';
import { InventoryModule } from './inventory/inventory.module';
import { ImageModule } from './image/image.module';
import { CategoryModule } from './category/category.module';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { DbhcModule } from './dbhc/dbhc.module';

@Module({
  imports: [
    ProductsModule,
    PaymentModule,
    OrderModule,
    InventoryModule,
    ImageModule,
    CategoryModule,
    AuthModule,
    CartModule,
    DbhcModule,
  ],
})
export class AppModule {}
