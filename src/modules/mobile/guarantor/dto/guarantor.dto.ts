import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class GuarantorDto {
 
    @IsNotEmpty()
    @IsString()
    readonly name: string;
 
     @IsNotEmpty()
     @IsPhoneNumber('NG',{
         message: "Invalid Phone Number"
     })
     readonly phoneNumber: string;
 }
