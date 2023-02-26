import { IsNotEmpty, IsEmail, IsEnum, IsPhoneNumber, Length, IsString, Matches } from 'class-validator';
import { BankBranch, Gender, Title } from 'src/core/constants';


export class RequestForApprovalDto {

    @IsNotEmpty()
    @IsString()
    readonly uniqueId: string;

    @IsNotEmpty()
    @IsString()
    readonly userId: string;

    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    @IsPhoneNumber('NG',{
        message: "Invalid Phone Number"
    })
    readonly phoneNumber: string;
}
