import { IsNotEmpty, Length, IsPhoneNumber } from 'class-validator';

export class OtpDto {

    @IsNotEmpty()
    @IsPhoneNumber('NG',{
        message: "Invalid Phone Number"
    })
    readonly phoneNumber: string;

    @IsNotEmpty()
    @Length(6,6, {
        message: "Otp Length should be 6"
    })
    readonly otp: string
}