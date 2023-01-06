import { IsNotEmpty, IsEmail, Length } from 'class-validator';

export class OtpEmailDto {

    @IsEmail()
    @IsNotEmpty()
    readonly email: string

    @IsNotEmpty()
    @Length(6,6, {
        message: "Otp Length should be 6"
    })
    readonly otp: string
}