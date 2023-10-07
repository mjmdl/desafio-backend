import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { PersonsService } from 'src/persons/persons.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductView } from './entities/product.view';
import { UpdateProductDto } from './dto/update-product.dto';
import { DeleteProductDto } from './dto/delete-product.dto';

@Controller('produtos')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly personsService: PersonsService,
  ) {}

  @Post()
  async create(@Body() creation: CreateProductDto): Promise<void> {
    await this.personsService.requireAdmin({ cpf: creation.creatorCpf });

    await this.productsService.create(creation);
  }

  @Get('/id=:id')
  async findId(@Param('id') id: number): Promise<object> {
    const product = await this.productsService.find(ProductView, { id });
    return { product };
  }

  @Get()
  async findFirstPage(): Promise<object> {
    const products = await this.productsService.findPage(ProductView, 0);
    return { products };
  }

  @Get('/pagina=:page')
  async findPage(@Param('page') page: number): Promise<object> {
    const products = await this.productsService.findPage(ProductView, page);
    return { products };
  }

  @Get('/pagina=:page/itens=:items')
  async findPageItems(
    @Param('page') page: number,
    @Param('items') items: number,
  ): Promise<object> {
    const products = await this.productsService.findPage(
      ProductView,
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

    await this.productsService.delete(deletion.productId);
  }
}
