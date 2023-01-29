import { IsNotEmpty, Length, IsPhoneNumber } from 'class-validator';

export class LoginDto {

    @IsNotEmpty()
    @IsPhoneNumber('NG',{
        message: "Invalid Phone Number"
    })
    readonly phoneNumber: string;

    @IsNotEmpty()
    @Length(6,6, {
        message: "Pin Length should be 6"
    })
    readonly pin: string
}