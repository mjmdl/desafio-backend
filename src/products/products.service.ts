import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  EntityManager,
  EntityTarget,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

// Padrão e máximo de produtos selecionados por SELECT.
const PRODUCTS_PER_PAGE = 20;

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,

    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async create(creation: CreateProductDto): Promise<number> {
    try {
      const result = await this.productsRepository.insert(creation);
      return result.identifiers[0].id;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException({
        message: 'Falha ao resgirar produto.',
      });
    }
  }

  async exist(where: FindOptionsWhere<Product>): Promise<boolean> {
    try {
      return await this.productsRepository.exist({ where });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException({
        message: 'Falha ao verificar existência de produto.',
      });
    }
  }

  async find<T>(
    entityClass: EntityTarget<T>,
    where: FindOptionsWhere<T>,
  ): Promise<T> {
    let product: T;

    try {
      product = await this.entityManager.findOneBy(entityClass, where);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException({
        message: 'Falha ao buscar produto.',
      });
    }

    if (!product) {
      throw new NotFoundException({
        message: 'Produto não encontrado.',
        filters: where,
      });
    }

    return product;
  }

  async findPage<T>(
    entityClass: EntityTarget<T>,
    page: number,
    pageSize: number = PRODUCTS_PER_PAGE,
    where?: Partial<T>,
  ): Promise<T[]> {
    if (pageSize > PRODUCTS_PER_PAGE) {
      pageSize = PRODUCTS_PER_PAGE;
    }

    let views: T[];
    try {
      views = await this.entityManager.find(entityClass, {
        where: where as FindOptionsWhere<T>,
        skip: page * pageSize,
        take: pageSize,
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException({
        message: 'Falha ao buscar produtos.',
      });
    }

    if (!views || views.length === 0) {
      throw new NotFoundException({
        message: 'Produtos não encontrados.',
        filters: where,
      });
    }

    return views;
  }

  async update(updation: UpdateProductDto): Promise<void> {
    if (Object.entries(updation.update).length === 0) {
      throw new BadRequestException({
        message: 'É necessário atualizar ao menos um campo.',
      });
    }

    try {
      await this.productsRepository.update(
        { id: updation.id },
        updation.update,
      );
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException({
        message: 'Falha ao atualizar produto.',
      });
    }
  }

  async delete(id: number) {
    try {
      await this.productsRepository.delete({ id });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException({
        message: 'Falha ao deletar produto.',
      });
    }
  }
}
