import {
    registerDecorator,
    ValidationOptions,
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
  } from 'class-validator';
  import { ClassConstructor } from "class-transformer";



export const ShouldNotMatch = <T>(
    type: ClassConstructor<T>,
    property: (o: T) => any,
    validationOptions?: ValidationOptions,
  ) => {
    return (object: any, propertyName: string) => {
      registerDecorator({
        target: object.constructor,
        propertyName,
        options: validationOptions,
        constraints: [property],
        validator: ShouldNotMatchConstraint,
      });
    };
  };
  
  @ValidatorConstraint({ name: "ShouldNotMatch" })
  export class ShouldNotMatchConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {
      const [fn] = args.constraints;
      return fn(args.object) != value;
    }
  
    defaultMessage(args: ValidationArguments) {
      const [constraintProperty]: (() => any)[] = args.constraints;
      return `${(constraintProperty + '').split('.')[1]} and ${args.property} should not match`;
    }
  }