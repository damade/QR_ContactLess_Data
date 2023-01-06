import { BusinessSector } from '@prisma/client';
import { IsNotEmpty, IsEnum, IsDate, IsInt, IsDateString, IsOptional, IsString, ValidateIf, IsPhoneNumber, IsBoolean, Contains } from 'class-validator';
import { EMPLOYMENT_STATUS } from 'src/core/constants';
import { Nullable } from 'src/core/model/util.data';
import { ValidateByAliasType } from 'src/core/validators/employment.validator';


export class BusinessProfileUpdateDto {

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
    
    @IsInt() 
    @IsNotEmpty()
    readonly monthlyTurnOver: number;

    @IsBoolean() 
    @IsNotEmpty()
    readonly isBusinessRegistered: boolean;
     
    @ValidateIf(data => data.isBusinessRegistered == true)
    @IsString()
    @IsNotEmpty()
    @Contains("RC")
    readonly rcNumber: string;
}