import { IsNotEmpty, IsEmail, Length, IsNumberString } from 'class-validator';


export class UserPinDto {

    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    @Length(6,6, {
        message: "Pin Length should be 6"
    })
    @IsNumberString()
    readonly pin: string;
    
}