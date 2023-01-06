import { IsNotEmpty, IsEnum, IsDate, IsDateString, IsInt, IsOptional, IsString, ValidateIf } from 'class-validator';
import { EMPLOYMENT_STATUS } from 'src/core/constants';
import { ValidateByAliasType } from 'src/core/validators/employment.validator';


export class EmploymentDto {
 
    @IsNotEmpty() 
    @IsEnum(EMPLOYMENT_STATUS, {
     message: 'Invalid Employment Status',
     })
    readonly employmentStatus: EMPLOYMENT_STATUS;
 
    @IsNotEmpty()
    @IsString()
    readonly employersName: string;
 
    @IsNotEmpty()
    @IsString()
    readonly companyAddress: string;
  
    @ValidateIf(data => data.employmentStatus === 'Employed')
    @IsDateString()
    @IsNotEmpty()
    readonly payDay: Date;
    
    @ValidateIf(data => data.employmentStatus === 'Employed' || data.employmentStatus ===
      'Selfemployed')
    @IsInt() 
    @IsNotEmpty()
    readonly monthlyIncome: number;
     
    @ValidateIf(data => data.employmentStatus === 'Unemployed')
    @IsInt()
    @IsNotEmpty()
    readonly unEmploymentDuration: number;
 }