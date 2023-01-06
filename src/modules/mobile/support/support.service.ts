import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Issues } from '@prisma/client';
import { ENUMS } from 'src/core/model/enums.entity';
import { getErrorMessage } from 'src/core/utils/helpers/error.helper';
import { EligibilityService } from '../eligibility/eligibility.service';
import { SupportDto } from './dto/support.dto';
import { SupportPrismaService } from './service/support.prisma.service';

@Injectable()
export class SupportService {
    constructor(private readonly issuesPrisma: SupportPrismaService) { }

    async createIssue(customerId: number, issue: SupportDto): Promise<Issues> {
        try {
            return await this.issuesPrisma.createSupportInfo({
                subject: issue.subject,
                issueCategory: issue.issueCategory,
                message: issue.message,
                user: {
                    connect: { id: customerId }
                }
            })
        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }

    }

    async getSupportInfos(id: string): Promise<Issues[] | null> {
        try {
            return await this.issuesPrisma.supportInfosByUserId({ userId: Number(id) })

        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async getSupportInfo(id: number): Promise<Issues | null> {
        try {
            return await this.issuesPrisma.supportInfo({ id: Number(id) })
        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async getIssueCategoryList(): Promise<ENUMS[]> {
        try {
            const enumsValue: ENUMS[]  = 
            [{
                name: "LoanApplication",
                value: "Loan Application"
            },{
                name: "LoanRepayment",
                value: "Loan Repayment"
            },{
                name: "LoanDisbursement",
                value: "Loan Disbursement"
            },{
                name: "Enquiries",
                value: "Enquiries"
            }]
            
            return enumsValue;
        }catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        };
    }
}
