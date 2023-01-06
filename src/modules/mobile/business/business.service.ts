import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BusinessProfile, LoanEligibility, LoanEligibilityIssue } from '@prisma/client';
import { ENUMS } from 'src/core/model/enums.entity';
import { getErrorMessage } from 'src/core/utils/helpers/error.helper';
import { getValueOrUndefined } from 'src/core/utils/helpers/string.helper';
import { MediaService } from 'src/core/utils/service/media.service';
import { EligibilityService } from '../eligibility/eligibility.service';
import { BusinessProfileDto } from './dto/business.profile.dto';
import { BusinessProfileUpdateDto } from './dto/business.profile.update.dto';
import { BusinessProfilePrismaService } from './services/business.profile.prisma.service';

@Injectable()
export class BusinessService {

    constructor(private readonly businessProfilePrisma: BusinessProfilePrismaService,
        private readonly mediaService: MediaService,
        private readonly loanEligibilityService: EligibilityService) { }

    //Creates Business Profile Without Returning Loan Issues    
    async createBusinessProfile(customerId: number, file: any, business: BusinessProfileDto):
        Promise<BusinessProfile> {
        const checkExistingProfile = await this.businessProfilePrisma
            .businessProfileByUserId({ userId: customerId })
        if (checkExistingProfile) {
            throw new HttpException("You already have a business profile, you can only edit", HttpStatus.BAD_REQUEST);
        }

        if (file) {
            var fileLink = await this.mediaService.uploadImage(file)
            .catch(
                error => {
                    throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
                });
        }
        

        return await this.businessProfilePrisma.createBusinessProfile({
            businessAddress: business.businessAddress,
            businessName: business.businessName,
            businessPhoneNumber: business.businessPhoneNumber,
            businessSector: business.businessSector,
            isBusinessRegistered: Boolean(business.isBusinessRegistered),
            monthlyTurnover: Number(business.monthlyTurnOver),
            cacUrl: fileLink || null ,
            isComplete: true,
            rcNumber: getValueOrUndefined(business.rcNumber, true),
            user: {
                connect: { id: customerId }
            }
        }).catch(error => {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
        )
            .finally(() => {
                this.loanEligibilityService
                    .updateEligibilityIssue(Number(customerId), LoanEligibilityIssue.BusinessProfile)
            });
    }

    //Creates Business Profile With Returning Loan Issues
    async createBusinessProfileWithLoanEligibility(customerId: number, file: any, business: BusinessProfileDto): Promise<LoanEligibility> {
        const checkExistingProfile = await this.businessProfilePrisma
            .businessProfileByUserId({ userId: customerId })
        if (checkExistingProfile) {
            throw new HttpException("You already have a business profile, you can only edit", HttpStatus.BAD_REQUEST);
        }
        if (file) {
            var fileLink = await this.mediaService.uploadImage(file)
            .catch(
                error => {
                    throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
                });
        }

     await this.businessProfilePrisma.createBusinessProfile({
            businessAddress: business.businessAddress,
            businessName: business.businessName,
            businessPhoneNumber: business.businessPhoneNumber,
            businessSector: business.businessSector,
            isBusinessRegistered: Boolean(business.isBusinessRegistered),
            monthlyTurnover: Number(business.monthlyTurnOver),
            cacUrl: fileLink || null,
            isComplete: true,
            rcNumber: getValueOrUndefined(business.rcNumber, true),
            user: {
                connect: { id: customerId }
            }
        }).catch(error => {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }).then(() => {
                this.loanEligibilityService
                    .updateEligibilityIssue(Number(customerId), LoanEligibilityIssue.BusinessProfile)
            });
        return this.loanEligibilityService.findUserLoanEligibility(customerId)
    }

    //pdating Business Profile
    async updateBusinessProfile(id: string, business: BusinessProfileUpdateDto): Promise<BusinessProfile> {
        const businessProfile = await this.businessProfilePrisma.businessProfileByUserId({ userId: Number(id) })
        if (!businessProfile) {
            throw new HttpException("No existing business profile, You have to add a business profile", HttpStatus.BAD_REQUEST);
        }
        return await this.businessProfilePrisma.updateBusinessProfile(
            {
                where: { id: businessProfile.id },
                data: {
                    businessAddress: business.businessAddress,
                    businessName: business.businessName,
                    businessPhoneNumber: business.businessPhoneNumber,
                    businessSector: business.businessSector,
                    isBusinessRegistered: business.isBusinessRegistered,
                    monthlyTurnover: business.monthlyTurnOver,
                    rcNumber: getValueOrUndefined(business.rcNumber, true), 
                },
            }
        ).catch(error => {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        });

    }

    //Updating Business Profile With Cac File
    async updateBusinessProfileWithCacFile(id: string, file: any, business: BusinessProfileDto): Promise<BusinessProfile> {
        const businessProfile = await this.businessProfilePrisma.businessProfileByUserId({ userId: Number(id) })
        if (!businessProfile) {
            throw new HttpException("No existing business profile, You have to add a business profile", HttpStatus.BAD_REQUEST);
        }

        
        if(file && businessProfile.cacUrl){
            throw new HttpException("CAC Image Already Exist, You Can't Update The Info.", HttpStatus.BAD_REQUEST);
        }

        if (file) {
            var fileLink = await this.mediaService.uploadImage(file)
            .catch(
                error => {
                    throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
                });
        }
        return await this.businessProfilePrisma.updateBusinessProfile(
            {
                where: { id: businessProfile.id },
                data: {
                    businessAddress: business.businessAddress,
                    businessName: business.businessName,
                    businessPhoneNumber: business.businessPhoneNumber,
                    businessSector: business.businessSector,
                    isBusinessRegistered: Boolean(business.isBusinessRegistered),
                    monthlyTurnover: Number(business.monthlyTurnOver),
                    cacUrl: getValueOrUndefined(fileLink),
                    rcNumber: getValueOrUndefined(business.rcNumber, true), 
                },
            }
        ).catch(error => {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        });

    }

    //Get User Business Profile
    async getBusinessProfile(id: string): Promise<BusinessProfile | null> {
        try {
            return await this.businessProfilePrisma.businessProfileWithUserIdByUserId({ userId: Number(id) })

        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    //Get Business Sector Dropdown information
    async getBusinessSectors(): Promise<ENUMS[]> {
        try {
            const enumsValue: ENUMS[]  = 
            [{
                name: "Agriculture",
                value: "Agriculture"
            },{
                name: "Aviation",
                value: "Aviation"
            },{
                name: "Commercial_Retail",
                value: "Commercial/Retail"
            },{
                name: "Construction",
                value: "Construction"
            },{
                name: "Education_Training",
                value: "Education and Training"
            },{
                name: "Energy_PowerGeneration",
                value: "Energy and Power Generation"
            },{
                name: "FMCG",
                value: "FMCG"
            },{
                name: "Fashion",
                value: "Fashion"
            },{
                name: "FinancialServices",
                value: "Financial Services"
            },{
                name: "Haulage_Logistics",
                value: "Haulage/Logistics"
            },{
                name: "Healthcare",
                value: "Healthcare"
            },{
                name: "Ict",
                value: "Ict"
            },{
                name: "Mining",
                value: "Mining"
            },{
                name: "Media_Entertainment",
                value: "Media & Entertainment"
            },{
                name: "Oil_Gas",
                value: "Oil & Gas"
            },{
                name: "ProfessionalServices",
                value: "Professional Services"
            },{
                name: "Telecommunication",
                value: "Telecommunication"
            },{
                name: "Tourism_Hospitality",
                value: "Tourism/Hospitality"
            },{
                name: "Transportation",
                value: "Transportation"
            },{
                name: "WasteManagement",
                value: "Waste Management"
            },{
                name: "Others",
                value: "Others"
            }]
            
            return enumsValue;
        }catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        };
    }
}


