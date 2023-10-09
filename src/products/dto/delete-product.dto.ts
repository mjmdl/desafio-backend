import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';
import { IsCpf } from 'src/commons/is-cpf.validator';
import { IsLength } from 'src/commons/is-length.validator';
import { Person } from 'src/persons/entities/person.entity';

export class DeleteProductDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  productId: number;

  @IsNotEmpty()
  @IsString()
  @IsLength(Person.CPF_LEN)
  @IsCpf()
  deletorCpf: string;
}
