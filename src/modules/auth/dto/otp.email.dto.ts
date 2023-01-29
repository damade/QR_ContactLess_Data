import { IsNotEmpty, IsEmail } from 'class-validator';

export class OtpEmailRequestDto {

    @IsEmail()
    @IsNotEmpty()
    readonly email: string
}