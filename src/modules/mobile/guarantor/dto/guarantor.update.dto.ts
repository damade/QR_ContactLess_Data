import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';


export class GuarantorUpdateDto {

   @IsNotEmpty()
   @IsString()
   readonly name: string;

   @IsNotEmpty()
   @IsPhoneNumber('NG', {
      message: "Invalid Phone Number"
   })
   readonly phoneNumber: string;
}