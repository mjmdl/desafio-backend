import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PersonsService } from './persons.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { PersonView } from './entities/person.view';

@Controller('pessoas')
export class PersonsController {
  constructor(private readonly personsService: PersonsService) {}

  @Post()
  async post(@Body() creation: CreatePersonDto): Promise<void> {
    await this.personsService.create(creation);
  }

  @Get('/cpf=:cpf')
  async getCpf(@Param('cpf') cpf: string) {
    return { person: await this.personsService.find(PersonView, { cpf }) };
  }

  @Get()
  async getFirstPage(): Promise<object> {
    return { products: await this.personsService.findPage(PersonView, 0) };
  }

  @Get('/pagina=:page')
  async getPage(@Param('page') page: number) {
    return { persons: await this.personsService.findPage(PersonView, page) };
  }

  @Get('/pagina=:page/itens=:items')
  async getPageItems(@Param() params: any) {
    return {
      persons: await this.personsService.findPage(
        PersonView,
        params['page'],
        params['items'],
      ),
    };
  }
}
