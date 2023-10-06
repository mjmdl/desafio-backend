import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { PersonsService } from 'src/persons/persons.service';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('produtos')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly personsService: PersonsService,
  ) {}

  @Post()
  async post(@Body() creation: CreateProductDto): Promise<void> {
    const creator = await this.personsService.findView({
      cpf: creation.creatorCpf,
    });

    if (!creator.admin) {
      throw new UnauthorizedException('Faltam privilégios.');
    }

    await this.productsService.create(creation);
  }

  @Get()
  async getFirstPage(): Promise<object> {
    return { products: await this.productsService.viewPage(0) };
  }

  @Get('/pagina=:page')
  async getPage(@Param('page') page: number): Promise<object> {
    return { products: await this.productsService.viewPage(page) };
  }
}
