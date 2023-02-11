import {
    registerDecorator,
    ValidationOptions,
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
  } from 'class-validator';
  import { ClassConstructor } from "class-transformer";
import { stateLg } from '../constants';



export const LGA = <T>(
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
        validator: LGAConstraint,
      });
    };
  };
  
  @ValidatorConstraint({ name: "LGA" })
  export class LGAConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {
      const [fn] = args.constraints;
      const state =  fn(args.object);
      const lga = stateLg.find(states => states.state.toLowerCase() === state.toLowerCase() || states.alias === state.toLowerCase());

      return lga ? lga.lgas.includes(value) || lga.lgas.includes(String(value).trimToSentenceCase()) : false
    
    }
  
    defaultMessage(args: ValidationArguments) {
      const [fn] = args.constraints;
      const state =  fn(args.object);
      return `${args.value} is not a LG in ${state} state`;
    }
  }