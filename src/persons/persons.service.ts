import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Person } from './entities/person.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PersonView } from './entities/person.view';
import { CreatePersonDto } from './dto/create-person.dto';

@Injectable()
export class PersonsService {
  constructor(
    @InjectRepository(Person)
    private readonly personsRepository: Repository<Person>,

    @InjectRepository(PersonView)
    private readonly personViewsRepository: Repository<PersonView>,
  ) {}

  async create(creation: CreatePersonDto): Promise<void> {
    if (creation.cpf.length !== Person.CPF_LEN) {
      throw new BadRequestException({
        message: `O CPF deve ter ${Person.CPF_LEN} dígitos.`,
      });
    }

    if (await this.exist({ cpf: creation.cpf })) {
      throw new ConflictException({ message: 'O CPF já está em uso.' });
    }

    try {
      await this.personsRepository.insert(creation);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException({
        message: 'Falha ao registrar pessoa.',
      });
    }
  }

  async exist(where: Partial<Person>): Promise<boolean> {
    try {
      return await this.personsRepository.exist({ where });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException({
        message: 'Falha ao verificar existência de pessoa.',
      });
    }
  }

  async find(where: Partial<Person>): Promise<Person> {
    let person: Person;
    try {
      person = await this.personsRepository.findOneBy(where);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException({
        message: 'Falha ao buscar pessoas.',
      });
    }

    if (!person) {
      throw new NotFoundException({
        message: 'Pessoa não encontrada.',
      });
    }

    return person;
  }

  async findView(where: Partial<PersonView>): Promise<PersonView> {
    let view: PersonView;
    try {
      view = await this.personViewsRepository.findOneBy(where);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException({
        message: 'Falha ao buscar pessoas.',
      });
    }

    if (!view) {
      throw new NotFoundException({
        message: 'Pessoa não encontrada.',
      });
    }

    return view;
  }

  async findViewPage(
    page: number = 0,
    where?: Partial<PersonView>,
  ): Promise<PersonView[]> {
    const PERSONS_PER_PAGE = 100;

    let views: PersonView[];
    try {
      views = await this.personViewsRepository.find({
        where,
        skip: page * PERSONS_PER_PAGE,
        take: PERSONS_PER_PAGE,
      });
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Falha ao buscar pessoas.',
      });
    }

    if (!views || views.length === 0) {
      throw new NotFoundException({
        message: 'Nenhuma pessoa encontrada.',
      });
    }

    return views;
  }
}
