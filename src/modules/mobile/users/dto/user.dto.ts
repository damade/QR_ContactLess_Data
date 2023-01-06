import { IsNotEmpty, IsEmail, IsEnum, IsPhoneNumber, Length, IsString, IsOptional, IsNumber, IsNumberString, isNumberString, isString } from 'class-validator';
import { GENDER, REFERRAL_SURVEY } from 'src/core/constants';


export class UserDto {
    @IsNotEmpty()
    @IsString()
    readonly firstName: string;

    @IsNotEmpty()
    @IsString()
    readonly lastName: string;

    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    @IsPhoneNumber('NG',{
        message: "Invalid Phone Number"
    })
    readonly phoneNumber: string;

    @IsNotEmpty()
    @Length(6,6, {
        message: "Pin Length should be 6"
    })
    @IsNumberString()
    readonly pin: string;
    

    @IsNotEmpty()
    @IsEnum(GENDER, {
        message: 'Gender must be either male or female',
    })
    readonly gender: GENDER;


    @IsNotEmpty()
    @Length(11,11, {
        message: "Bvn Length should be 11"
    })
    @IsNumberString()
    readonly bvn: string;

    readonly bvnIndex: string;

    @IsString()
    @IsOptional()
    readonly referrer: string;

    @IsString()
    @IsOptional()
    readonly referralCode: string;

    @IsEnum(REFERRAL_SURVEY, {
        message: 'Invalid Referral Type',
    })
    @IsNotEmpty()
    readonly surveyType: REFERRAL_SURVEY

    @IsString()
    @IsOptional()
    readonly surveyTypeOther: string;

}