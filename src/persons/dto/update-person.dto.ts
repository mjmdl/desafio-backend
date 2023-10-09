import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreatePersonDto } from './create-person.dto';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { IsLength } from 'src/commons/is-length.validator';
import { Person } from '../entities/person.entity';
import { Type } from 'class-transformer';

class PutPersonDto extends PartialType(OmitType(CreatePersonDto, ['cpf'])) {}

export class UpdatePersonDto {
  @IsNotEmpty()
  @IsString()
  @IsLength(Person.CPF_LEN)
  updatorCpf: string;

  @IsNotEmpty()
  @IsString()
  @IsLength(Person.CPF_LEN)
  targetCpf: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => PutPersonDto)
  update: PutPersonDto;
}
