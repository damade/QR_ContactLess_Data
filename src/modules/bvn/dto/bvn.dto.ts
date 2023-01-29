import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsOptional, IsBoolean, ValidateNested } from 'class-validator';
import { UserDto } from 'src/modules/users/dto/user.dto';


export class BvnDto {
    @IsNotEmpty()
    @IsString()
    readonly occupation: string;

    @IsOptional()
    @IsString()
    readonly language: string;

    @IsNotEmpty()
    @IsBoolean()
    readonly isApproved: boolean;

    readonly bvn: string;

    readonly userId: string;


    @IsNotEmpty()
    @Type(() => UserDto)
    @ValidateNested()
    readonly user: UserDto;

}