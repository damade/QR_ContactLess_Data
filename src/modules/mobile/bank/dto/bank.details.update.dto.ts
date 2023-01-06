import { IsNotEmpty, IsPhoneNumber, IsString, Length } from 'class-validator';


export class BankDetailsUpdateDto {

   @IsNotEmpty()
   @Length(10,10, {
       message: "Account Number Length should be 10"
   })
    readonly nuban: string;

    @IsNotEmpty()
    @IsString()
    readonly bankName: string;

    @IsNotEmpty()
    @IsString()
    readonly accountName: string;
    
}