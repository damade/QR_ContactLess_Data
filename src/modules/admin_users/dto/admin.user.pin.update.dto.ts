import { IsNotEmpty, Length, IsString, Matches } from 'class-validator';
import { ShouldNotMatch } from 'src/core/validators/shouldnotmatch.validator';


export class AdminUserPasswordChangeDto {

    @IsNotEmpty()
    @Length(6,15, {
        message: "Password Length should be at least six and at most fifteen letters"
    })
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'Password too weak'})
    @IsString()
    readonly newPassword: string;

    @IsNotEmpty()
    @ShouldNotMatch(AdminUserPasswordChangeDto, (s) => s.newPassword)
    @Length(6,15, {
        message: "Password Length should be at least six and at most fifteen letters"
    })
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'Password too weak'})
    @IsString()
    readonly oldPassword: string;
    
}