import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { IsLength } from 'src/commons/is-length.validator';
import { Person } from 'src/persons/entities/person.entity';
import { CreateOrderProductDto } from './create-order-product.dto';
import { IsCpf } from 'src/commons/is-cpf.validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  @IsLength(Person.CPF_LEN)
  @IsCpf()
  customerCpf: string;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderProductDto)
  products: CreateOrderProductDto[];
}
