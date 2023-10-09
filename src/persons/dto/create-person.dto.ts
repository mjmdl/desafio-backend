import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Person } from '../entities/person.entity';
import { IsLength } from 'src/commons/is-length.validator';
import { IsCpf } from 'src/commons/is-cpf.validator';

export class CreatePersonDto {
  @IsNotEmpty()
  @IsString()
  @Length(Person.NAME_MIN, Person.NAME_MAX)
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsLength(Person.CPF_LEN)
  @IsCpf()
  cpf: string;

  @IsOptional()
  @IsBoolean()
  admin?: boolean;
}
