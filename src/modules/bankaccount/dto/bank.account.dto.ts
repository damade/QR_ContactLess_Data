import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsOptional, IsBoolean, ValidateNested, Length, IsNumberString, ValidateIf, IsBooleanString } from 'class-validator';
import { AddressDto } from 'src/modules/users/dto/address.dto';
import { UserDto } from 'src/modules/users/dto/user.dto';


export class BankProfileDto {

    @ValidateIf(verifyDto => verifyDto.isCreatingBvn == false || verifyDto.isCreatingBvn == "false")
    @IsNotEmpty()
    @Length(11,11, {
        message: "Bvn Length should be 11"
    })
    @IsNumberString()
    readonly bvn: string;

    readonly bvnIndex: string;

    @Length(11,11, {
        message: "Nin Length should be 11"
    })
    @IsNumberString()
    @IsNotEmpty()
    readonly nin: string;

    readonly ninIndex: string;

    @IsNotEmpty()
    @IsString()
    readonly motherMaidenName: string;

    @IsOptional()
    @IsString()
    readonly taxIdentificationNumber: string;

    readonly userImage: string;

    readonly userId: string;

    @IsNotEmpty()
    @IsBooleanString()
    readonly isCreatingBvn: boolean;

    @IsNotEmpty()
    @Type(() => UserDto)
    @ValidateNested()
    readonly user: UserDto;
}
