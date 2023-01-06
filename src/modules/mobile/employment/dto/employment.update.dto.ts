import { IsNotEmpty, IsEnum, IsDate, IsInt, IsDateString, IsOptional, IsString, ValidateIf } from 'class-validator';
import { EMPLOYMENT_STATUS } from 'src/core/constants';
import { Nullable } from 'src/core/model/util.data';
import { ValidateByAliasType } from 'src/core/validators/employment.validator';


export class EmploymentUpdateDto {

   @IsNotEmpty()
   @IsEnum(EMPLOYMENT_STATUS, {
      message: 'Invalid Employment Status',
   })
   readonly employmentStatus: EMPLOYMENT_STATUS;

   @ValidateIf(data => data.employmentStatus === 'Employed')
   @IsNotEmpty()
   @IsString()
   readonly employersName: Nullable<string>;

   @ValidateIf(data => data.employmentStatus === 'Employed')
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