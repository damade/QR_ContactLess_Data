import { Type } from 'class-transformer';
import { IsNotEmpty, IsEmail, IsEnum, IsPhoneNumber, Length, IsString, IsOptional, IsNumber, IsNumberString, isNumberString, isString, Matches, IsEmpty, IsDateString, ValidateNested } from 'class-validator';
import { Gender, IDENTIFICATION_TYPE, MARITAL_STATUS, REFERRAL_SURVEY, STATE, Title } from 'src/core/constants';
import { AddressDto } from './address.dto';


export class UserDto {

    readonly uniqueId: string;

    @IsNotEmpty()
    @IsEnum(Title, {
        message: 'Title must be known',
    })
    readonly title: Title;

    @IsDateString()
    @IsNotEmpty()
    readonly dateOfBirth: Date;

    @IsNotEmpty()
    @IsString()
    readonly firstName: string;

    @IsNotEmpty()
    @IsString()
    readonly lastName: string;

    @IsNotEmpty()
    @IsString()
    readonly middleName: string;

    readonly fullName: string

    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    @IsPhoneNumber('NG',{
        message: "Invalid Phone Number"
    })
    readonly phoneNumber: string;

    @IsNotEmpty()
    @Length(6,15, {
        message: "Password Length should be at least six and at most fifteen letters"
    })
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'Password too weak'})
    @IsString()
    readonly password: string;

    @IsNotEmpty()
    @IsEnum(STATE, {
        message: 'State is not in Nigeria.',
    })
    readonly stateOfOrigin: STATE;

    @IsNotEmpty()
    @IsEnum(STATE, {
        message: 'State is not in Nigeria.',
    })
    readonly placeOfBirth: STATE;

    @IsNotEmpty()
    @IsEnum(Gender, {
        message: 'Gender must be either male or female',
    })
    readonly gender: Gender;

    @IsString()
    @IsNotEmpty()
    readonly lgaOfOrigin: string;

    @IsString()
    @IsNotEmpty()
    readonly nationality: string;

    @IsEnum(MARITAL_STATUS, {
        message: 'Marital Status must be Single or Married or Divorce',
    })
    @IsNotEmpty()
    readonly maritalStatus: MARITAL_STATUS;

    @IsNotEmpty()
    @IsEnum(IDENTIFICATION_TYPE, {
        message: 'Invalid Identification Type',
    })
    readonly identificationType: IDENTIFICATION_TYPE;

    @IsString()
    @IsNotEmpty()
    readonly idCardNo: string;

    readonly signatureUrl: string;

    readonly isCreatingBvn?: boolean;

    readonly isCreatingAccount?: boolean;

    @IsNotEmpty()
    @Type(() => AddressDto)
    @ValidateNested()
    readonly address: AddressDto;

}