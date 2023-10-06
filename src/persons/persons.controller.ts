import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PersonsService } from './persons.service';
import { CreatePersonDto } from './dto/create-person.dto';

@Controller('pessoas')
export class PersonsController {
  constructor(private readonly personsService: PersonsService) {}

  @Post()
  async post(@Body() creation: CreatePersonDto): Promise<void> {
    await this.personsService.create(creation);
  }

  @Get('/cpf=:cpf')
  async getByCpf(@Param('cpf') cpf: string) {
    return { person: await this.personsService.findView({ cpf }) };
  }

  @Get()
  async getFirstPage() {
    return { persons: await this.personsService.findViewPage(0) };
  }

  @Get('/pagina=:page')
  async getPage(@Param('page') page: number) {
    return { persons: await this.personsService.findViewPage(page) };
  }
}
