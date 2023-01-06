import { IsNotEmpty, IsEmail, Length, IsNumberString } from 'class-validator';
import { ShouldNotMatch } from 'src/core/validators/shouldnotmatch.validator';


export class UserPinChangeDto {

    @IsNotEmpty()
    @Length(6,6, {
        message: "Pin Length should be 6"
    })
    @IsNumberString()
    readonly newPin: string;

    @IsNotEmpty()
    @ShouldNotMatch(UserPinChangeDto, (s) => s.newPin)
    @Length(6,6, {
        message: "Pin Length should be 6"
    })
    @IsNumberString()
    readonly oldPin: string;
    
}