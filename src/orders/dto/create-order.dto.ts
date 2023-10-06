import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { IsLength } from 'src/commons/is-length.validator';
import { Person } from 'src/persons/entities/person.entity';
import { CreateOrderProductDto } from './create-order-product.dto';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  @IsLength(Person.CPF_LEN)
  customerCpf: string;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderProductDto)
  orderProducts: CreateOrderProductDto[];
}
