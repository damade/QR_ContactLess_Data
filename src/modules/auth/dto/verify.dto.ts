import { IsNotEmpty, IsString, IsOptional, IsEmail, IsPhoneNumber, Length, IsNumberString, ValidateIf, IsBooleanString, IsEnum } from 'class-validator';
import { AccountType, NextOfKinRelationship } from 'src/core/constants';


export class VerifyDto {

    @ValidateIf(verifyDto => verifyDto.isCreatingBvn == true || verifyDto.isCreatingBvn == "true")
    @IsNotEmpty()
    @IsString()
    readonly occupation: string;

    @IsOptional()
    @IsString()
    readonly language: string;

    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    @IsPhoneNumber('NG',{
        message: "Invalid Phone Number"
    })
    readonly phoneNumber: string;

    @ValidateIf(verifyDto => verifyDto.isCreatingBvn == false || verifyDto.isCreatingBvn == "false")
    @IsNotEmpty()
    @Length(11,11, {
        message: "Bvn Length should be 11"
    })
    @IsNumberString()
    readonly bvn: string;

    @Length(11,11, {
        message: "Nin Length should be 11"
    })
    @IsNumberString()
    @IsNotEmpty()
    readonly nin: string;

    @IsNotEmpty()
    @IsString()
    readonly motherMaidenName: string;

    @IsOptional()
    @IsString()
    readonly taxIdentificationNumber: string;

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

    @IsNotEmpty()
    @IsBooleanString()
    readonly isCreatingBvn: boolean;

}