import { IsNotEmpty, IsEmail, IsEnum, IsPhoneNumber, Length, IsString, Matches, Contains, IsIn } from 'class-validator';
import { AdminIds, BankBranch, Gender, Title } from 'src/core/constants';


export class AdminPasswordRequestDto {

    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    @IsPhoneNumber('NG',{
        message: "Invalid Phone Number"
    })
    readonly phoneNumber: string;

    @IsNotEmpty()
    @Length(6, 6, {
        message: "Staff Id has to be six letters"
    })
    @IsIn(AdminIds, {
        message: "Invalid Staff Id, can not be matched"
    })
    @IsString()
    readonly staffId: string;

}
