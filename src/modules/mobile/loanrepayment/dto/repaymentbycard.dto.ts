import { IsNotEmpty, IsEmail, IsEnum, IsPhoneNumber, Length, IsString, IsOptional, IsNumber, IsNumberString, isNumberString, isString, IsDateString } from 'class-validator';
import { GENDER, REFERRAL_SURVEY } from 'src/core/constants';


export class RepaymentByCardDto {
    @IsNotEmpty()
    @IsString()
    readonly amount: string;

    @IsNotEmpty()
    @IsString()
    readonly cardId: string;

    @IsNotEmpty()
    @IsNumber()
    readonly authCode: string;

    @IsNotEmpty()
    @IsEmail()
    readonly email: string;
}