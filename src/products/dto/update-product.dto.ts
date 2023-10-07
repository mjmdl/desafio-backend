import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { IsLength } from 'src/commons/is-length.validator';
import { Person } from 'src/persons/entities/person.entity';
import { Type } from 'class-transformer';

class PutProductDto extends PartialType(
  OmitType(CreateProductDto, ['creatorCpf']),
) {}

export class UpdateProductDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  id: number;

  @IsNotEmpty()
  @IsString()
  @IsLength(Person.CPF_LEN)
  updatorCpf: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => PutProductDto)
  updatedProduct: PutProductDto;
}
