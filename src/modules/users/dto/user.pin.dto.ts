import { IsNotEmpty, IsEmail, Length, IsString, Matches } from 'class-validator';


export class UserPasswordDto {

    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    @Length(6,15, {
        message: "Password Length should be at least six and at most fifteen letters"
    })
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'Password too weak'})
    @IsString()
    readonly password: string;
    
}