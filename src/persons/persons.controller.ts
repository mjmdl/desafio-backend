import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { PersonsService } from './persons.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { PersonView } from './entities/person.view';
import { AuthPersonDto } from './dto/auth-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';

@Controller('pessoas')
export class PersonsController {
  constructor(private readonly personsService: PersonsService) {}

  @Post()
  async create(@Body() creation: CreatePersonDto): Promise<void> {
    await this.personsService.create(creation);
  }

  @Get('/cpf=:cpf')
  async findCpf(@Param('cpf') cpf: string) {
    const person = await this.personsService.find(PersonView, { cpf });
    return { person };
  }

  @Post('lista')
  @HttpCode(HttpStatus.OK)
  async findFirstPage(@Body() auth: AuthPersonDto): Promise<object> {
    await this.personsService.requireAdmin({ cpf: auth.cpf });

    const products = await this.personsService.findPage(PersonView, 0);
    return { products };
  }

  @Post('lista/pagina=:page')
  @HttpCode(HttpStatus.OK)
  async findPage(@Param('page') page: number, @Body() auth: AuthPersonDto) {
    await this.personsService.requireAdmin({ cpf: auth.cpf });

    const persons = await this.personsService.findPage(PersonView, page);
    return { persons };
  }

  @Post('lista/pagina=:page/itens=:items')
  @HttpCode(HttpStatus.OK)
  async findPageItems(
    @Param('page') page: number,
    @Param('items') items: number,
    @Body() auth: AuthPersonDto,
  ) {
    await this.personsService.requireAdmin({ cpf: auth.cpf });

    const persons = await this.personsService.findPage(PersonView, page, items);
    return { persons };
  }

  @Put()
  async update(@Body() updation: UpdatePersonDto): Promise<void> {
    // Verifica se está atualizando outrem ou permissões admin e se tem permissão para isso.
    const isUpdatingSelf = updation.updatorCpf === updation.targetCpf;
    if (!isUpdatingSelf || updation.updatedPerson.admin !== null) {
      await this.personsService.requireAdmin({ cpf: updation.updatorCpf });
    }

    await this.personsService.update(updation);
  }
}
