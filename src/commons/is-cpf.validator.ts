import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidatorOptions,
  registerDecorator,
} from 'class-validator';

export function isCpf(cpf: string): boolean {
  // return true;
  if (!cpf) return false;

  cpf = cpf.replace(/\D/g, '');

  const CPF_LEN = 11;
  if (cpf.length !== CPF_LEN) {
    return false;
  }

  const ALL_ONES = 11111111111;
  for (let i = 0; i < 10; i++) {
    if (cpf === String(ALL_ONES * i)) {
      return false;
    }
  }

  {
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf[i]) * (10 - i);
    }

    let rest = sum % 11;
    let valDigit = rest < 2 ? 0 : 11 - rest;
    if (valDigit !== parseInt(cpf[9])) {
      return false;
    }
  }

  {
    let sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf[i]) * (11 - i);
    }

    let rest = sum % 11;
    let valDigit = rest < 2 ? 0 : 11 - rest;
    if (valDigit !== parseInt(cpf[10])) {
      return false;
    }
  }

  return true;
}

const IS_CPF = 'IsCpf';

@ValidatorConstraint({ name: IS_CPF, async: true })
class IsCpfValidator implements ValidatorConstraintInterface {
  async validate(cpf: string, args?: ValidationArguments): Promise<boolean> {
    return isCpf(cpf);
  }

  defaultMessage?(args?: ValidationArguments): string {
    return `${args.value} não é um CPF válido.`;
  }
}

export function IsCpf(options?: ValidatorOptions) {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options,
      validator: IsCpfValidator,
    });
  };
}
