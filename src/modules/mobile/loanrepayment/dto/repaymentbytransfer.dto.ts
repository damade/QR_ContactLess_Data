import { IsNotEmpty, IsEmail, IsEnum, IsPhoneNumber, Length, IsString, IsOptional, IsNumber, IsNumberString, isNumberString, isString, IsDateString } from 'class-validator';
import { GENDER, REFERRAL_SURVEY } from 'src/core/constants';


export class RepaymentByTransferDto {
    @IsNotEmpty()
    @IsString()
    readonly referenceNumber: string;

    @IsNotEmpty()
    @IsString()
    readonly loanUniqueId: string;

    @IsNotEmpty()
    @IsDateString()
    readonly transactionDate: Date;

    @IsNotEmpty()
    @IsNumber()
    readonly repaymentAmount: number;
}