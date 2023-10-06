import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UnauthorizedException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { PersonsService } from 'src/persons/persons.service';
import { CreateProductDto } from './dto/create-product.dto';
import { PersonView } from 'src/persons/entities/person.view';
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
  async post(@Body() creation: CreateProductDto): Promise<void> {
    await this.personsService.requireAdmin({ cpf: creation.creatorCpf });
    await this.productsService.create(creation);
  }

  @Get('/id=:id')
  async getId(@Param('id') id: number): Promise<object> {
    return { product: await this.productsService.find(ProductView, { id }) };
  }

  @Get()
  async getFirstPage(): Promise<object> {
    return { products: await this.productsService.findPage(ProductView, 0) };
  }

  @Get('/pagina=:page')
  async getPage(@Param('page') page: number): Promise<object> {
    return { products: await this.productsService.findPage(ProductView, page) };
  }

  @Get('/pagina=:page/itens=:items')
  async getPageItems(@Param() params: any): Promise<object> {
    return {
      products: await this.productsService.findPage(
        ProductView,
        params['page'],
        params['items'],
      ),
    };
  }

  @Put()
  async put(@Body() updation: UpdateProductDto): Promise<void> {
    await this.personsService.requireAdmin({ cpf: updation.updatorCpf });
    await this.productsService.update(updation);
  }

  @Delete()
  async delete(@Body() deletion: DeleteProductDto): Promise<void> {
    await this.personsService.requireAdmin({
      cpf: deletion.deletorCpf,
    });

    // await this.productsService.delete(deletion.productId);
  }
}
