import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { PersonsService } from 'src/persons/persons.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductView } from './entities/product.view';
import { UpdateProductDto } from './dto/update-product.dto';
import { DeleteProductDto } from './dto/delete-product.dto';
import { ProductToUserView } from './entities/product-to-user.view';

@Controller('produtos')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly personsService: PersonsService,
  ) {}

  @Post()
  async create(@Body() creation: CreateProductDto): Promise<object> {
    await this.personsService.requireAdmin({ cpf: creation.creatorCpf });

    const id = await this.productsService.create(creation);
    return { id };
  }

  @Get()
  async findId(@Query('id') id: number = 0): Promise<object> {
    const product = await this.productsService.find(ProductView, { id });
    return { product };
  }

  @Get('lista')
  async findPageItems(
    @Query('pagina') page: number = 0,
    @Query('itens') items: number = 0,
  ): Promise<object> {
    const products = await this.productsService.findPage(
      ProductToUserView,
      page,
      items,
    );
    return { products };
  }

  @Put()
  async update(@Body() updation: UpdateProductDto): Promise<void> {
    await this.personsService.requireAdmin({ cpf: updation.updatorCpf });

    await this.productsService.update(updation);
  }

  @Delete()
  async delete(@Body() deletion: DeleteProductDto): Promise<void> {
    await this.personsService.requireAdmin({
      cpf: deletion.deletorCpf,
    });

    if (!(await this.productsService.exist({ id: deletion.productId }))) {
      throw new NotFoundException({
        message: 'Produto não encontrado.',
      });
    }

    try {
      await this.productsService.delete(deletion.productId);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException({
        message: 'Falha ao deletar produto.',
      });
    }
  }
}
