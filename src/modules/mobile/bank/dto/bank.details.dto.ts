import { IsNotEmpty, IsPhoneNumber, IsString, Length } from 'class-validator';

export class BankDetailsDto {

    @IsNotEmpty()
    @Length(10,10, {
        message: "Account Number Length should be 10"
    })
    @IsString()
     readonly nuban: string;
 
     @IsNotEmpty()
     @IsString()
     readonly bankName: string;

     @IsNotEmpty()
     @IsString()
     readonly accountName: string;
 }
