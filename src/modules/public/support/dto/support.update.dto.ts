import { IssueCategory, IssueResolutionStatus } from '@prisma/client';
import { IsNotEmpty, IsEnum, IsString, IsOptional, IsInt } from 'class-validator';

export class SupportUpdateDto {
 
    @IsNotEmpty() 
    @IsEnum(IssueResolutionStatus, {
     message: 'Invalid Resolution Status',
     })
    readonly resolutionStatus: IssueResolutionStatus;

    @IsNotEmpty() 
    @IsInt()
    readonly id: number;

     @IsOptional()
     @IsString()
     readonly remark: string;
 }
