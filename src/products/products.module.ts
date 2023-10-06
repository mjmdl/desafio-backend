import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { PersonsModule } from 'src/persons/persons.module';
import { ProductView } from './entities/product.view';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductView]), PersonsModule],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
