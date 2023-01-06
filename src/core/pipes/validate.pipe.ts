import { Injectable, ArgumentMetadata, BadRequestException, ValidationPipe, UnprocessableEntityException, HttpException, HttpStatus } from '@nestjs/common';
import { getErrorMessage } from '../utils/helpers/error.helper';

@Injectable()
export class ValidateInputPipe extends ValidationPipe {
   public async transform(value, metadata: ArgumentMetadata) {
      try {
        return await super.transform(value, metadata);
      } catch (e) {
         if (e instanceof BadRequestException) {
            throw new UnprocessableEntityException(this.handleError(e));
         }else{
             throw new HttpException(getErrorMessage(e), HttpStatus.BAD_REQUEST)
         }
      }
   }

   private handleError(errors) {
         const errorMessages = errors.response.message;
         var errorMessage = ""
         errorMessages.forEach(element => {
            errorMessage += (element + ", ")
         });
        return errorMessage;
   }
}