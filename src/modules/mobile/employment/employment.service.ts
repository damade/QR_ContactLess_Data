import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EmploymentProfile, EmploymentStatus, LoanEligibility, LoanEligibilityIssue } from '@prisma/client';
import { getErrorMessage } from 'src/core/utils/helpers/error.helper';
import { getValueOrUndefined } from 'src/core/utils/helpers/string.helper';
import { EligibilityService } from '../eligibility/eligibility.service';
import { EmploymentDto } from './dto/employment.dto';
import { EmploymentUpdateDto } from './dto/employment.update.dto';
import { EmploymentPrismaService } from './services/employment.prisma.service';

@Injectable()
export class EmploymentService {
    constructor(private readonly employmentPrisma: EmploymentPrismaService,
        private readonly loanEligibilityService: EligibilityService) { }

    async createEmploymentProfile(customerId: number, employment: EmploymentDto): Promise<EmploymentProfile> {
        const checkExistingProfile = await this.employmentPrisma
            .employmentProfileByUserId({ userId: customerId })
        if (checkExistingProfile) {
            throw new HttpException("You already have an employment profile, you can only edit", HttpStatus.BAD_REQUEST);
        }

        return await this.employmentPrisma.createEmploymentProfile({
            employmentStatus: EmploymentStatus[employment.employmentStatus],
            employersName: getValueOrUndefined(employment.employersName),
            unEmploymentDuration: getValueOrUndefined(employment.employersName),
            companyAddress: getValueOrUndefined(employment.companyAddress),
            payDay: employment.payDay != null ? employment.payDay : undefined,
            monthlyIncome: getValueOrUndefined(employment.monthlyIncome),
            user: {
                connect: { id: customerId }
            }
        }).catch(error => {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
        )
            .finally(() => {
                this.loanEligibilityService
                    .updateEligibilityIssue(Number(customerId), LoanEligibilityIssue.EmploymentProfile)
            });
    }

    async createEmploymentProfileWithLoanEligibility(customerId: number, employment: EmploymentDto): Promise<LoanEligibility> {
        const checkExistingProfile = await this.employmentPrisma
            .employmentProfileByUserId({ userId: customerId })
        if (checkExistingProfile) {
            throw new HttpException("You already have an employment profile, you can only edit", HttpStatus.BAD_REQUEST);
        }

        await this.employmentPrisma.createEmploymentProfile({
            employmentStatus: EmploymentStatus[employment.employmentStatus],
            employersName: getValueOrUndefined(employment.employersName),
            unEmploymentDuration: getValueOrUndefined(employment.unEmploymentDuration),
            companyAddress: getValueOrUndefined(employment.companyAddress),
            payDay: employment.payDay != null ? employment.payDay : undefined,
            monthlyIncome: getValueOrUndefined(employment.monthlyIncome),
            user: {
                connect: { id: customerId }
            }
        }).catch(error => {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }).then(() => {
            this.loanEligibilityService
                .updateEligibilityIssue(Number(customerId), LoanEligibilityIssue.EmploymentProfile)
        });
        return this.loanEligibilityService.findUserLoanEligibility(customerId)
    }

    async updateEmploymentProfile(id: string, employment: EmploymentUpdateDto): Promise<EmploymentProfile> {
        const employmentProfile = await this.employmentPrisma.employmentProfileByUserId({ userId: Number(id) })
        if (!employmentProfile) {
            throw new HttpException("No existing profile, You have to create an employment", HttpStatus.BAD_REQUEST);
        }
        return await this.employmentPrisma.updateEmploymentProfile(
            {
                where: { id: employmentProfile.id },
                data: {
                    employmentStatus: EmploymentStatus[employment.employmentStatus],
                    employersName: getValueOrUndefined(employment.employersName, true),
                    unEmploymentDuration: getValueOrUndefined(employment.unEmploymentDuration, true),
                    companyAddress: getValueOrUndefined(employment.companyAddress, true),
                    payDay: employment.payDay != null ? employment.payDay : null,
                    monthlyIncome: getValueOrUndefined(employment.monthlyIncome, true),
                    isComplete: true
                },
            }
        ).catch(error => {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        });

    }

    async getEmploymentProfile(id: string): Promise<EmploymentProfile | null> {
        try {
            return await this.employmentPrisma.employmentProfileByUserId({ userId: Number(id) })

        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

}
