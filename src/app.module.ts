import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonsModule } from './persons/persons.module';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';
import { POSTGRES_CONFIG } from './configs/postgres.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(POSTGRES_CONFIG),
    PersonsModule,
    OrdersModule,
    ProductsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
