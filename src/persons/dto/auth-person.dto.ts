import { IsLength } from 'src/commons/is-length.validator';
import { Person } from '../entities/person.entity';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AuthPersonDto {
  @IsNotEmpty()
  @IsString()
  @IsLength(Person.CPF_LEN)
  cpf: string;

  @IsOptional()
  @IsBoolean()
  admin: boolean = false;
}
