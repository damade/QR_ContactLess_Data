import { IsNotEmpty, IsEnum, Length, IsDateString, MaxDate, IsDate, IsNumberString, IsString, IsOptional } from 'class-validator';
import { IDENTIFICATION_TYPE, MARITAL_STATUS, STATE } from 'src/core/constants';


export class AddressDto {

    @IsNotEmpty()
    @IsString()
    readonly address: string;

    @IsNotEmpty()
    @IsString()
    readonly landmark: string;

    @IsNotEmpty()
    @IsString()
    readonly city: string;

    @IsNotEmpty()
    @IsString()
    readonly lga: string;

    @IsNotEmpty()
    @IsEnum(STATE, {
        message: 'State is not in Nigeria.',
    })
    readonly state: STATE;

}