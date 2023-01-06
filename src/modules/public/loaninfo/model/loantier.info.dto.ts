import { IsBoolean, IsEnum, IsInt, IsNotEmpty } from 'class-validator';
import { LoanType } from './loan.rate.entity';
import { LoanTierGroup } from './loan.tier.entity';

export class LoanTierInfoDto {
 
    @IsNotEmpty()
    @IsEnum(LoanTierGroup, {
        message: 'Incorrect LoanTier',
    })
    readonly loanTier: LoanTierGroup;

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
