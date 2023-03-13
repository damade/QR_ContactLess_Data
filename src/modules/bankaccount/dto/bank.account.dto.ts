import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsOptional, IsBoolean, ValidateNested, Length, IsNumberString, ValidateIf, IsBooleanString, IsEmail, IsPhoneNumber, IsEnum } from 'class-validator';
import { AccountType, NextOfKinRelationship } from 'src/core/constants';
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

    @IsNotEmpty()
    @IsString()
    readonly nextOfKinFullName: string;

    @IsNotEmpty()
    @IsString()
    readonly nextOfKinAddress: string;

    @IsNotEmpty()
    @IsEmail()
    @IsString()
    readonly nextOfKinEmail: string;

    @IsNotEmpty()
    @IsPhoneNumber('NG',{
        message: "Invalid Phone Number"
    })
    readonly nextOfKinPhoneNumber: string;

    @IsNotEmpty()
    @IsEnum(NextOfKinRelationship, {
        message: 'Relationship kind not listed.',
    })
    readonly nextOfKinRelationship: NextOfKinRelationship;

    @IsNotEmpty()
    @IsEnum(AccountType, {
        message: 'Account Type Not Accepted.',
    })
    readonly accountType: AccountType;

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
