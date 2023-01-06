import { IsBoolean, IsInt, IsNotEmpty } from 'class-validator';

export class LoanTierInfoUpdateDto {

     @IsNotEmpty()
     @IsInt()
     readonly minRange: number;

     @IsNotEmpty()
     @IsInt()
     readonly maxRange: number;

     @IsNotEmpty()
     @IsBoolean()
     readonly isCustom: boolean;

 }
