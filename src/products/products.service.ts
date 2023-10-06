import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductView } from './entities/product.view';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,

    @InjectRepository(ProductView)
    private readonly productViewsRepository: Repository<ProductView>,
  ) {}

  async create(creation: CreateProductDto): Promise<void> {
    try {
      await this.productsRepository.insert(creation);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException({
        message: 'Falha ao resgirar produto.',
      });
    }
  }

  async find(where: Partial<Product>): Promise<Product> {
    let product: Product;

    try {
      product = await this.productsRepository.findOneBy(where);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException({
        message: 'Falha ao buscar produto.',
      });
    }

    if (!product) {
      throw new NotFoundException('Produto não encontrado.');
    }

    return product;
  }

  async viewPage(
    page: number,
    where?: Partial<ProductView>,
  ): Promise<ProductView[]> {
    const PRODUCTS_PER_PAGE = 100;

    let views: ProductView[];
    try {
      views = await this.productViewsRepository.find({
        where,
        skip: page * PRODUCTS_PER_PAGE,
        take: PRODUCTS_PER_PAGE,
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException({
        message: 'Falha ao buscar produtos.',
      });
    }

    if (!views || views.length === 0) {
      throw new NotFoundException('Produtos não encontrados.');
    }

    return views;
  }
}
