import { IsNotEmpty, IsPhoneNumber, IsString, Length } from 'class-validator';

export class BankDto {
 
     @IsNotEmpty()
     @IsString()
     readonly bank: string;

     @IsNotEmpty()
     @IsString()
     readonly bankCode: string;

     @IsNotEmpty()
     @IsString()
     readonly bankShortName: string;


     
 }
