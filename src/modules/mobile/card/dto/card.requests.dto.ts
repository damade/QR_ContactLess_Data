import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsPhoneNumber, IsString, Length } from 'class-validator';

export class AddCardRequestDto {

    @IsNotEmpty()
    @IsString()
    readonly reference: string;

    @IsNotEmpty()
    @IsInt()
    readonly amount: number;
 
     @IsNotEmpty()
     @IsInt()
     readonly userId: number;

     @IsNotEmpty()
     @IsBoolean()
     readonly isDefaultCard: boolean;
 }
