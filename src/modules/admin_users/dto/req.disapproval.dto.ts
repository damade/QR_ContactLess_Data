import { IsNotEmpty, IsEmail, IsEnum, IsPhoneNumber, Length, IsString, Matches, IsOptional, IsBoolean } from 'class-validator';
import { BankBranch, Gender, Title } from 'src/core/constants';


export class RequestForDisapprovalDto {

    @IsNotEmpty()
    @IsString()
    readonly uniqueId: string;

    @IsNotEmpty()
    @IsString()
    readonly userId: string;

    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsOptional()
    @IsString()
    readonly comment: string;

    @IsNotEmpty()
    @IsBoolean()
    readonly isProfileImageTheIssue: boolean;

    @IsNotEmpty()
    @IsPhoneNumber('NG',{
        message: "Invalid Phone Number"
    })
    readonly phoneNumber: string;
}
