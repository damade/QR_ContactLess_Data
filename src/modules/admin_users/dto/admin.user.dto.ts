import { IsNotEmpty, IsEmail, IsEnum, IsPhoneNumber, Length, IsString, Matches } from 'class-validator';
import { BankBranch, Gender, Title } from 'src/core/constants';


export class AdminUserDto {

    readonly uniqueId: string;

    @IsNotEmpty()
    @IsEnum(Title, {
        message: 'Title must be known',
    })
    readonly title: Title;

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
    @Length(6,15, {
        message: "Password Length should be at least six and at most fifteen letters"
    })
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'Password too weak'})
    @IsString()
    readonly password: string;

    @IsNotEmpty()
    @IsEnum(Gender, {
        message: 'Gender must be either male or female',
    })
    readonly gender: Gender;


    @IsNotEmpty()
    @IsEnum(BankBranch, {
        message: 'Branch from bank is not listed',
    })
    readonly bankBranch: BankBranch;

}
