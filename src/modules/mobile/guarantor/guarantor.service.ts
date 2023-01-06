import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Guarantor, LoanEligibility, LoanEligibilityIssue, SetupStatus } from '@prisma/client';
import { getErrorMessage } from 'src/core/utils/helpers/error.helper';
import { EligibilityService } from '../eligibility/eligibility.service';
import { GuarantorDto } from './dto/guarantor.dto';
import { GuarantorUpdateDto } from './dto/guarantor.update.dto';
import { GuarantorPrismaService } from './service/guarantor.prisma.service';

@Injectable()
export class GuarantorService {
    constructor(private readonly guarantorPrisma: GuarantorPrismaService,
        private readonly loanEligibilityService: EligibilityService) { }

    async createGuarantor(customerId: number ,guarantor: GuarantorDto): Promise<Guarantor> {
        try {
            const checkExistingProfile = await this.guarantorPrisma.guarantorInfoByUserId
                 ({ userId: customerId })
            if (checkExistingProfile) {
                throw new HttpException("You already have an guarantor profile, you can only edit", HttpStatus.BAD_REQUEST);
            }

            return await this.guarantorPrisma.createGuarantorInfo({
                name: guarantor.name,
                phoneNumber: guarantor.phoneNumber,
                approvalStatus: SetupStatus.Pending,
                user: {
                    connect: { id: customerId }
                }
            }).finally(() => {
                this.loanEligibilityService
                    .updateEligibilityIssue(Number(customerId), LoanEligibilityIssue.GuarantorProfile)
            });
        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }

    }

    async createGuarantorWithLoanEligibility(customerId: number ,guarantor: GuarantorDto): Promise<LoanEligibility> {
        try {
            const checkExistingProfile = await this.guarantorPrisma.guarantorInfoByUserId
                 ({ userId: customerId })
            if (checkExistingProfile) {
                throw new HttpException("You already have an guarantor profile, you can only edit", HttpStatus.BAD_REQUEST);
            }

             await this.guarantorPrisma.createGuarantorInfo({
                name: guarantor.name,
                phoneNumber: guarantor.phoneNumber,
                approvalStatus: SetupStatus.Pending,
                user: {
                    connect: { id: customerId }
                }
            }).catch(error => {
                throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
            }).then(() => {
                this.loanEligibilityService
                    .updateEligibilityIssue(Number(customerId), LoanEligibilityIssue.GuarantorProfile)
            });

            return this.loanEligibilityService.findUserLoanEligibility(Number(customerId))
        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }

    }

    async updateGuarantor(id: string, guarantor: GuarantorUpdateDto): Promise<Guarantor> {
        try {
            const guarantorInfo = await this.guarantorPrisma.guarantorInfoByUserId({ userId: Number(id) })
            if (!guarantorInfo) {
                throw new HttpException("No existing guarantor information, You have to add one.", HttpStatus.BAD_REQUEST);
            }
            return await this.guarantorPrisma.updateGuarantorInfo(
                {
                    where: { id: guarantorInfo.id },
                    data: {
                        name: guarantor.name,
                        phoneNumber: guarantor.phoneNumber,
                        approvalStatus: SetupStatus.Pending,
                    },
                }
            );
        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async getGuarantor(id: string): Promise<Guarantor | null> {
        try {
            return await this.guarantorPrisma.guarantorInfoByUserId({ userId: Number(id) })

        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
