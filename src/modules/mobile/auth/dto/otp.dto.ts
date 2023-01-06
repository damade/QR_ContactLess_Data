import { IsNotEmpty, IsEmail, IsOptional, IsPhoneNumber } from 'class-validator';

export class OtpRequestDto {

    @IsNotEmpty()
    @IsPhoneNumber('NG',{
        message: "Invalid Phone Number"
    })
    readonly phoneNumber: string;

    @IsEmail()
    @IsOptional()
    readonly email: string
}