import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { Tenure } from 'src/core/constants';
import { LoanTierGroup } from './loan.tier.entity';

export class LoanRateInfoUpdateDto {

    @IsNotEmpty()
    @IsEnum(Tenure, {
        message: 'Incorrect Tenure',
    })
    readonly tenure: Tenure;

     @IsNotEmpty()
     @IsInt()
     readonly rate: number;

     @IsNotEmpty()
     @IsBoolean()
     readonly isCustom: boolean;

     @IsNotEmpty()
     @IsBoolean()
     readonly isAvailableToAllTiers: boolean;

     
      @IsOptional()
      @IsEnum(LoanTierGroup, { message: 'Incorrect Loan Tier', each: true })
     tiersAvailable: LoanTierGroup[]
 }
