import { IsNotEmpty, IsEmail, IsEnum, IsPhoneNumber, Length, IsString, IsOptional, IsNumber, IsNumberString, isNumberString, isString, IsInt } from 'class-validator';
import { GENDER, REFERRAL_SURVEY, Tenure } from 'src/core/constants';


export class LoanRequestDto {
    @IsNotEmpty()
    @IsInt()
    readonly loanAmount: number;

    @IsNotEmpty()
    @IsInt()
    readonly loanInterestRate: number;

    @IsNotEmpty()
    @IsInt()
    readonly interestAmount: number;

    @IsNotEmpty()
    @IsInt()
    readonly totalAmount: number;

    @IsNotEmpty()
    @IsInt()
    readonly cardId: number;

    @IsNotEmpty()
    @IsInt()
    readonly loanTenureInMonths: number;

    @IsNotEmpty()
    @IsEnum(Tenure, {
        message: 'Invalid Tenure Type',
    })
    readonly loanTenure: Tenure;
    
    @IsNotEmpty()
    @IsString()
    readonly reasonForLoan: string;

    @IsOptional()
    @IsString()
    readonly nuban: string;

    @IsNotEmpty()
    @IsString()
    readonly last4: string;

}