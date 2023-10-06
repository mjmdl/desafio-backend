import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  EntityManager,
  EntityTarget,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { Person } from './entities/person.entity';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { CreatePersonDto } from './dto/create-person.dto';
import { PersonView } from './entities/person.view';

// Padrão e máximo de pessoas selecionadas por SELECT.
const PERSONS_PER_PAGE = 20;

@Injectable()
export class PersonsService {
  constructor(
    @InjectRepository(Person)
    private readonly personsRepository: Repository<Person>,

    @InjectEntityManager()
    private readonly entityManager: EntityManager,
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

  async exist(where: FindOptionsWhere<Person>): Promise<boolean> {
    try {
      return await this.personsRepository.exist({ where });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException({
        message: 'Falha ao verificar existência de pessoa.',
      });
    }
  }

  async requireAdmin(where: Partial<PersonView>): Promise<void> {
    let person;
    try {
      person = await this.personsRepository.findOne({
        select: { admin: true },
        where,
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException({
        message: 'Falha ao buscar.',
      });
    }

    if (!person) {
      throw new NotFoundException({
        message: 'Pessoa não encontrada.',
      });
    }

    console.log(person);
    if (!person.admin) {
      throw new UnauthorizedException({
        message: 'Lhe faltam privilégios.',
      });
    }
  }

  async find<T>(entityClass: EntityTarget<T>, where: Partial<T>): Promise<T> {
    let entity: T;
    try {
      entity = await this.entityManager.findOne(entityClass, {
        where: where as FindOptionsWhere<T>,
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException({
        message: 'Falha ao buscar pessoa.',
      });
    }

    if (!entity) {
      throw new NotFoundException({
        message: 'Pessoa não encontrada.',
      });
    }

    return entity;
  }

  async findPage<T>(
    entityClass: EntityTarget<T>,
    page: number = 0,
    pageSize: number = PERSONS_PER_PAGE,
    where?: Partial<T>,
  ): Promise<T[]> {
    if (pageSize > PERSONS_PER_PAGE) {
      pageSize = PERSONS_PER_PAGE;
    }

    let entities: T[];
    try {
      entities = await this.entityManager.find(entityClass, {
        where: where as FindOptionsWhere<T>,
        skip: page * pageSize,
        take: pageSize,
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException({
        message: 'Falha ao buscar pessoas.',
      });
    }

    if (!entities || entities.length === 0) {
      throw new NotFoundException({
        message: 'Pessoas não encontradas.',
      });
    }

    return entities;
  }
}
