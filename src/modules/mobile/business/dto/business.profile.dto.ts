import { BusinessSector } from '@prisma/client';
import { IsNotEmpty, IsEnum, IsDate, IsDateString, IsInt, IsOptional, IsString, ValidateIf, IsPhoneNumber, IsBoolean, IsNumberString, IsBooleanString, Contains } from 'class-validator';
import { EMPLOYMENT_STATUS } from 'src/core/constants';
import { ValidateByAliasType } from 'src/core/validators/employment.validator';


export class BusinessProfileDto {
 
    @IsNotEmpty() 
    @IsEnum(BusinessSector, {
     message: 'Invalid Business Sector',
     })
    readonly businessSector: BusinessSector;
 
    @IsNotEmpty()
    @IsString()
    readonly businessName: string;
 
    @IsNotEmpty()
    @IsString()
    readonly businessAddress: string;
  
    @IsNotEmpty()
    @IsPhoneNumber('NG',{
        message: "Invalid Phone Number"
    })
    readonly businessPhoneNumber: string;
    
    @IsNumberString()
    @IsNotEmpty()
    readonly monthlyTurnOver: number;

    @IsBooleanString()
    @IsNotEmpty()
    readonly isBusinessRegistered: boolean;
     
    @ValidateIf(data => data.isBusinessRegistered == "true")
    @IsString()
    @IsNotEmpty()
    @Contains("RC")
    readonly rcNumber: string;
 }