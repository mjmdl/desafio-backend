import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
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

  @Post(['pagina=:page/itens=:items', 'pagina=:page', '/pagina'])
  @HttpCode(HttpStatus.OK)
  async findPageItems(
    @Param('page') page: number,
    @Param('items') items: number,
    @Body() auth: AuthPersonDto,
  ) {
    await this.personsService.requireAdmin({ cpf: auth.cpf });

    const persons = await this.personsService.findPage(
      PersonView,
      page ?? 0,
      items ?? 0,
    );
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
