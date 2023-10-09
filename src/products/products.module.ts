import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { PersonsModule } from 'src/persons/persons.module';
import { ProductView } from './entities/product.view';
import { ProductToUserView } from './entities/product-to-user.view';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductView, ProductToUserView]),
    PersonsModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
