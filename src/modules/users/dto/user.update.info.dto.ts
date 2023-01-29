import { IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { MARITAL_STATUS, STATE } from 'src/core/constants';


export class UserUpdateInfoDto {

    @IsEnum(MARITAL_STATUS, {
        message: 'Marital Status must be Single or Married or Divorce',
    })
    readonly maritalStatus: MARITAL_STATUS;

    @IsNotEmpty()
    readonly address: string;

    @IsOptional()
    readonly landMark: string;

    @IsNotEmpty()
    @IsEnum(STATE, {
        message: 'State is not in Nigeria.',
    })
    readonly state: STATE;

}