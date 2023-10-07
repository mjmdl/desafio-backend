import { IsLength } from 'src/commons/is-length.validator';
import { Person } from '../entities/person.entity';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthPersonDto {
  @IsNotEmpty()
  @IsString()
  @IsLength(Person.CPF_LEN)
  cpf: string;
}
