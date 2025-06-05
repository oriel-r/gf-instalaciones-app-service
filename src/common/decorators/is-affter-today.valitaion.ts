import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import * as fns from 'date-fns'

export function IsTodayOrAffterToday (validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isAfterToday',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _args: ValidationArguments) {
          if (!value) return false;
          const now = new Date()
          const date = new Date(value);
          return (date > now || fns.isSameDay(now, date));
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} debe ser una fecha posterior a la actual`;
        },
      },
    });
  };
}
