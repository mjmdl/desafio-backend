import { Length } from 'class-validator';

export function IsLength(length: number) {
  return Length(length, length, {
    message(args) {
      return `${args.property} deve ter ${args.constraints[0]} caracteres.`;
    },
  });
}
