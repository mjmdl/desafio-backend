import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderProduct } from './entities/order-product.entity';
import { PersonsModule } from 'src/persons/persons.module';
import { ProductsModule } from 'src/products/products.module';
import { OrderView } from './entities/order.view';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderProduct, OrderView]),
    PersonsModule,
    ProductsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
