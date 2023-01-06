import {
    registerDecorator,
    ValidationOptions,
    ValidationArguments,
    isEmail,
  } from 'class-validator';
import { EMPLOYMENT_STATUS } from '../constants';
 
  
export function ValidateByAliasType(
    property: string,
    validationOptions?: ValidationOptions,
  ) {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function (object: Object, propertyName: string) {
      registerDecorator({
        name: 'ValidateByAliasType',
        target: object.constructor,
        propertyName: propertyName,
        constraints: [property],
        options: validationOptions,
        validator: {
          validate(value: any, args: ValidationArguments) {
            const [relatedPropertyName] = args.constraints;
            const relatedValue = (args.object as any)[relatedPropertyName];
            if (relatedValue === EMPLOYMENT_STATUS.Employed) {
              return value != null &&  typeof value === 'number'  ;
            }else if(relatedValue === EMPLOYMENT_STATUS.Selfemployed){
              return value != null &&  typeof value === 'number'  ;
            }

            return false;
          },
          
          defaultMessage(args?: ValidationArguments) {
            const [relatedPropertyName] = args.constraints;
            const relatedValue = (args.object as any)[relatedPropertyName];
            switch (relatedValue) {
              case EMPLOYMENT_STATUS.Employed:
                return 'This information should not be null or empty';
            }
          },
        },
      });
    };
  }