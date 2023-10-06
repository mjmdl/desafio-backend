import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import { Product } from '../entities/product.entity';
import { IsLength } from 'src/commons/is-length.validator';
import { Person } from 'src/persons/entities/person.entity';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @Length(Product.NAME_MIN, Product.NAME_MAX)
  name: string;

  @IsNotEmpty()
  @IsNumber()
  value: number;

  @IsOptional()
  @IsBoolean()
  favorite: boolean;

  @IsNotEmpty()
  @IsString()
  @MaxLength(Product.DESCRIPTION_MAX)
  description: string;

  @IsNotEmpty()
  @IsString()
  @IsLength(Person.CPF_LEN)
  creatorCpf: string;
}
