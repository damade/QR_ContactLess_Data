import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsOptional, IsBoolean, ValidateNested } from 'class-validator';
import { BankProfileDto } from 'src/modules/bankaccount/dto/bank.account.dto';


export class BvnDto {
    @IsNotEmpty()
    @IsString()
    readonly occupation: string;

    @IsOptional()
    @IsString()
    readonly language: string;

    @IsOptional()
    @IsBoolean()
    readonly isApproved: boolean;

    readonly bvn: string;

    readonly userId: string;


    @IsNotEmpty()
    @Type(() => BankProfileDto)
    @ValidateNested()
    readonly bankProfile: BankProfileDto;

}