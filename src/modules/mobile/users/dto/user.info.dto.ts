import { IsNotEmpty, IsEnum, Length, IsDateString, MaxDate, IsDate, IsNumberString, IsString, IsOptional } from 'class-validator';
import { IDENTIFICATION_TYPE, MARITAL_STATUS, STATE } from 'src/core/constants';


export class UserInfoDto {
    
    @IsDateString()
    @IsNotEmpty()
    readonly dateOfBirth: Date;


    @IsEnum(MARITAL_STATUS, {
        message: 'Marital Status must be Single or Married or Divorce',
    })
    readonly maritalStatus: MARITAL_STATUS;

    @IsEnum(IDENTIFICATION_TYPE, {
        message: 'Invalid Identification Type',
    })
    readonly identificationType: IDENTIFICATION_TYPE;

    @IsNotEmpty()
    @Length(11,11, {
        message: "Nin Length should be 11"
    })
    @IsNumberString()
    readonly nin: string;

    @IsNotEmpty()
    @IsString()
    readonly address: string;

    @IsOptional()
    readonly landMark: string;

    @IsNotEmpty()
    @IsEnum(STATE, {
        message: 'State is not in Nigeria.',
    })
    readonly state: STATE;

}