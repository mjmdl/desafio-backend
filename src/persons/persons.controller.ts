import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PersonsService } from './persons.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { PersonView } from './entities/person.view';
import { AuthPersonDto } from './dto/auth-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { Person } from './entities/person.entity';

@Controller('pessoas')
export class PersonsController {
  constructor(private readonly personsService: PersonsService) {}

  @Post()
  async create(@Body() creation: CreatePersonDto): Promise<void> {
    await this.personsService.create(creation);
  }

  @Get()
  async findCpf(@Query('cpf') cpf: string = '') {
    if (cpf.length !== Person.CPF_LEN) {
      throw new BadRequestException({
        message: `CPF deve ter ${Person.CPF_LEN} dígitos`,
      });
    }

    const person = await this.personsService.find(PersonView, { cpf });
    return { person };
  }

  @Post('lista')
  @HttpCode(HttpStatus.OK)
  async findPageItems(
    @Query('pagina') page: number = 0,
    @Query('itens') items: number = 0,
    @Body() auth: AuthPersonDto,
  ) {
    await this.personsService.requireAdmin({ cpf: auth.cpf });

    const persons = await this.personsService.findPage(PersonView, page, items);
    return { persons };
  }

  @Put()
  async update(@Body() updation: UpdatePersonDto): Promise<void> {
    const isUpdatingSelf = updation.updatorCpf === updation.targetCpf;
    const isUpdatingAdmin = updation.update.admin !== null;
    if (!isUpdatingSelf || isUpdatingAdmin) {
      await this.personsService.requireAdmin({ cpf: updation.updatorCpf });
    }

    await this.personsService.update(updation);
  }
}
