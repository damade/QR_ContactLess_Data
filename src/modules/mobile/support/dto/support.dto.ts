import { IssueCategory } from '@prisma/client';
import { IsNotEmpty, IsEnum, IsString } from 'class-validator';

export class SupportDto {
 
    @IsNotEmpty()
    @IsString()
    readonly subject: string;
 
    @IsNotEmpty() 
    @IsEnum(IssueCategory, {
     message: 'Invalid Issue Category',
     })
    readonly issueCategory: IssueCategory;

     @IsNotEmpty()
     @IsString()
     readonly message: string;
 }
